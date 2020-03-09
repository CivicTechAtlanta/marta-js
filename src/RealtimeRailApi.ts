import moment, { Moment, Duration } from 'moment-timezone'
import axios from 'axios'
import { applyCallback, convertApiDateTimeFormat, convertNextArrivalTime, Callback, Direction } from './utils'

// https://itsmarta.com/railline-schedules.aspx
export type Line = 'RED' | 'GOLD' | 'GREEN' | 'BLUE'

export interface RailArrival {
  destination: string
  direction: Direction
  eventTime: Moment
  line: Line
  nextArrival: Moment
  station: Station
  trainId: string
  waitingTimeSeconds: number
  waitingTime: Duration
  waitingState: 'Boarding' | 'Arriving' | string
}

// https://itsmarta.com/train-stations-and-schedules.aspx
// TODO: use GTFS to allow the user to query these, instead of hard-coding them
// (as this data can change over time)
export type Station =
  | 'OMNI DOME STATION'
  | 'BUCKHEAD STATION'
  | 'NORTH AVE STATION'
  | 'GEORGIA STATE STATION'
  | 'LENOX STATION'
  | 'MEDICAL CENTER STATION'
  | 'VINE CITY STATION'
  | 'BANKHEAD STATION'
  | 'MIDTOWN STATION'
  | 'OAKLAND CITY STATION'
  | 'KING MEMORIAL STATION'
  | 'DORAVILLE STATION'
  | 'ASHBY STATION'
  | 'DUNWOODY STATION'
  | 'ARTS CENTER STATION'
  | 'LINDBERGH STATION'
  | 'LAKEWOOD STATION'
  | 'SANDY SPRINGS STATION'
  | 'WEST LAKE STATION'
  | 'INMAN PARK STATION'
  | 'EDGEWOOD CANDLER PARK STATION'
  | 'EAST POINT STATION'
  | 'HAMILTON E HOLMES STATION'
  | 'NORTH SPRINGS STATION'
  | 'EAST LAKE STATION'
  | 'COLLEGE PARK STATION'
  | 'CIVIC CENTER STATION'
  | 'AIRPORT STATION'
  | 'DECATUR STATION'
  | 'BROOKHAVEN STATION'
  | 'PEACHTREE CENTER STATION'
  | 'AVONDALE STATION'
  | 'FIVE POINTS STATION'
  | 'CHAMBLEE STATION'
  | 'GARNETT STATION'
  | 'KENSINGTON STATION'
  | 'WEST END STATION'
  | 'INDIAN CREEK STATION'

/*
  {
    "DESTINATION": "North Springs",
    "DIRECTION": "N",
    "EVENT_TIME": "3/4/2020 9:44:36 PM",
    "LINE": "RED",
    "NEXT_ARR": "09:44:46 PM",
    "STATION": "BUCKHEAD STATION",
    "TRAIN_ID": "408306",
    "WAITING_SECONDS": "-32",
    "WAITING_TIME": "Boarding" // or "Arriving" or  "3 min"
  }
*/
type ApiRailDirection = 'N' | 'S' | 'E' | 'W'
interface ApiRailArrivalResponse {
  DESTINATION: string
  DIRECTION: ApiRailDirection
  EVENT_TIME: string
  LINE: 'RED' | 'GOLD' | 'BLUE' | 'GREEN'
  NEXT_ARR: string
  STATION: string
  TRAIN_ID: string
  WAITING_SECONDS: string
  WAITING_TIME: 'Boarding' | 'Arriving' | string
}

const REALTIME_RAIL_ENDPOINT = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals'

export class RealtimeRailApi {
  private readonly apiKey: string
  constructor (apiKey: string) {
    if (apiKey == null || apiKey.length === 0) {
      throw new Error('An API Key is required to use the realtime rail endpoint')
    }
    this.apiKey = apiKey
  }

  async getArrivals (callback?: Callback<RailArrival[]>): Promise<RailArrival[]> {
    return applyCallback(callback, async () => {
      const res: ApiRailArrivalResponse[] = await this.request(REALTIME_RAIL_ENDPOINT)
      return res.map(r => this.convertResponse(r))
    })
  }

  async getArrivalsForStation (station: Station, callback?: Callback<RailArrival[]>): Promise<RailArrival[]> {
    return applyCallback(callback, async () => {
      // there isn't a separate API for this, so we load all the data and filter for the user
      const allArrivals = await this.getArrivals()
      return allArrivals.filter(a => a.station === station)
    })
  }

  private async request<T> (url: string): Promise<T> {
    const res = await axios.get(url, { params: { apikey: this.apiKey } })
    return res.data
  }

  private convertRailDirection (apiDirection: ApiRailDirection): Direction {
    switch (apiDirection) {
      case 'N': return 'North'
      case 'S': return 'South'
      case 'E': return 'East'
      case 'W': return 'West'
    }
  }

  private convertResponse (res: ApiRailArrivalResponse): RailArrival {
    const waitingTimeSeconds = parseInt(res.WAITING_SECONDS, 10)
    return {
      destination: res.DESTINATION,
      direction: this.convertRailDirection(res.DIRECTION),
      eventTime: convertApiDateTimeFormat(res.EVENT_TIME),
      line: res.LINE,
      nextArrival: convertNextArrivalTime(res.NEXT_ARR),
      station: res.STATION as Station,
      trainId: res.TRAIN_ID,
      waitingTimeSeconds,
      waitingTime: moment.duration(waitingTimeSeconds, 'seconds'),
      waitingState: res.WAITING_TIME
    }
  }
}
