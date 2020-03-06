import moment, { Moment, Duration } from 'moment-timezone'
import axios from 'axios'

import { applyCallback, convertApiDateTimeFormat, Callback, Direction } from './utils'

export interface BusArrival {
  adherence: Duration
  blockId: string
  blockAbbriviation: string
  direction: Direction
  latitude: number
  longitude: number
  eventTime: Moment
  route: string
  stopId: string
  timepoint: string
  tripId: string
  busId: string
}

/*
  {
    "ADHERENCE": "-23",
    "BLOCKID": "315",
    "BLOCK_ABBR": "30-9",
    "DIRECTION": "Eastbound",
    "LATITUDE": "33.8455188",
    "LONGITUDE": "-84.2512385",
    "MSGTIME": "3/4/2020 8:33:18 PM",
    "ROUTE": "30",
    "STOPID": "902040",
    "TIMEPOINT": "LaVista Rd & Oak Grove Rd",
    "TRIPID": "7025856",
    "VEHICLE": "1410"
  }
*/
type ApiBusDirection = 'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound'
interface ApiBusArrivalResponse {
  ADHERENCE: string
  BLOCKID: string
  BLOCK_ABBR: string
  DIRECTION: ApiBusDirection
  LATITUDE: string
  LONGITUDE: string
  MSGTIME: string
  ROUTE: string
  STOPID: string
  TIMEPOINT: string
  TRIPID: string
  VEHICLE: string
}

const REALTIME_BUS_ALL_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus'
const REALTIME_BUS_ROUTE_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute'

export class RealtimeBusApi {
  async getArrivals (callback?: Callback<BusArrival[]>): Promise<BusArrival[]> {
    return applyCallback(callback, async () => {
      const res: ApiBusArrivalResponse[] = await this.request(REALTIME_BUS_ALL_ENDPOINT)
      return res.map(r => this.convertResponse(r))
    })
  }

  async getArrivalsForRoute (route: string, callback?: Callback<BusArrival[]>): Promise<BusArrival[]> {
    return applyCallback(callback, async () => {
      const res: ApiBusArrivalResponse[] = await this.request(`${REALTIME_BUS_ROUTE_ENDPOINT}/${route}`)
      return res.map(r => this.convertResponse(r))
    })
  }

  private async request<T> (url: string): Promise<T> {
    const res = await axios.get(url)
    return res.data
  }

  private convertBusDirection (apiDirection: ApiBusDirection): Direction {
    switch (apiDirection) {
      case 'Northbound': return 'North'
      case 'Southbound': return 'South'
      case 'Eastbound': return 'East'
      case 'Westbound': return 'West'
    }
  }

  private convertResponse (res: ApiBusArrivalResponse): BusArrival {
    // Note: from the API, a positive number indicates bus is running late, and a
    // a negative number indicates bus is running early. I think this is opposite of what
    // is expected so we reverse it here.
    const adheranceMinutes = -1 * parseInt(res.ADHERENCE, 10)
    return {
      adherence: moment.duration(adheranceMinutes, 'minutes'),
      blockId: res.BLOCKID,
      blockAbbriviation: res.BLOCK_ABBR,
      direction: this.convertBusDirection(res.DIRECTION),
      latitude: parseFloat(res.LATITUDE),
      longitude: parseFloat(res.LONGITUDE),
      eventTime: convertApiDateTimeFormat(res.MSGTIME),
      route: res.ROUTE,
      stopId: res.STOPID,
      timepoint: res.TIMEPOINT,
      tripId: res.TRIPID,
      busId: res.VEHICLE
    }
  }
}
