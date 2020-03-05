import { Direction, Moment, Duration } from './CommonTypes'

// https://itsmarta.com/railline-schedules.aspx
export type Line = 'RED' | 'GOLD' | 'GREEN' | 'BLUE'

export type RailArrival = {
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
