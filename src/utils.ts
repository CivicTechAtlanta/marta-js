import moment from 'moment-timezone'

import { Callback, Direction, Moment } from './CommonTypes'
import { ApiBusDirection, ApiBusArrivalResponse, ApiRailDirection, ApiRailArrivalResponse } from './ApiTypes'
import { BusArrival, BusRoute } from './BusTypes'
import { RailArrival, Station } from './RailTypes'

export async function applyCallback <T> (callback: Callback<T> | undefined, method: () => Promise<T>): Promise<T> {
  const promise = method()
  if (typeof callback !== 'undefined') {
    promise.then(res => callback(null, res)).catch(err => callback(err, null))
  }
  return promise
}

const TIMEZONE = 'America/New_York'
const TIME_FORMAT = 'M/D/YYYY h:mm:ss A'

export function convertApiDateTimeFormat (formattedTime: string): Moment {
  return moment.tz(formattedTime, TIME_FORMAT, TIMEZONE)
}

function convertBusDirection (apiDirection: ApiBusDirection): Direction {
  switch (apiDirection) {
    case 'Northbound': return 'North'
    case 'Southbound': return 'South'
    case 'Eastbound': return 'East'
    case 'Westbound': return 'West'
  }
}

export function convertApiBusArrival (res: ApiBusArrivalResponse): BusArrival {
  // Note: from the API, a positive number indicates bus is running late, and a
  // a negative number indicates bus is running early. I think this is opposite of what
  // is expected so we reverse it here.
  const adheranceMinutes = -1 * parseInt(res.ADHERENCE, 10)
  return {
    adherence: moment.duration(adheranceMinutes, 'minutes'),
    blockId: res.BLOCKID,
    blockAbbriviation: res.BLOCK_ABBR,
    direction: convertBusDirection(res.DIRECTION),
    latitude: parseFloat(res.LATITUDE),
    longitude: parseFloat(res.LONGITUDE),
    eventTime: convertApiDateTimeFormat(res.MSGTIME),
    route: res.ROUTE as BusRoute,
    stopId: res.STOPID,
    timepoint: res.TIMEPOINT,
    tripId: res.TRIPID,
    busId: res.VEHICLE
  }
}

function convertRailDirection (apiDirection: ApiRailDirection): Direction {
  switch (apiDirection) {
    case 'N': return 'North'
    case 'S': return 'South'
    case 'E': return 'East'
    case 'W': return 'West'
  }
}

// arrival time comes in just a time, like "09:44:46 PM"
// to convert to a moment, we need to find the next point
// in the future where it is that time (not necessarily today,
// since times roll over at midnight)
export function convertNextArrivalTime (arrivalTime: string): Moment {
  const now = moment.tz(TIMEZONE)
  const yesterdayDate = now.clone().subtract(1, 'day').format('M/D/YYYY')
  const todayDate = now.format('M/D/YYYY')
  const tomrrowDate = now.clone().add(1, 'day').format('M/D/YYYY')
  const yesterdayAtTime = convertApiDateTimeFormat(`${yesterdayDate} ${arrivalTime}`)
  const todayAtTime = convertApiDateTimeFormat(`${todayDate} ${arrivalTime}`)
  const tomorrowAtTime = convertApiDateTimeFormat(`${tomrrowDate} ${arrivalTime}`)
  // select the closest to the current time
  const yesterdayAge = Math.abs(now.diff(yesterdayAtTime))
  const todayAge = Math.abs(now.diff(todayAtTime))
  const tomorrowAge = Math.abs(now.diff(tomorrowAtTime))
  switch (Math.min(yesterdayAge, todayAge, tomorrowAge)) {
    case yesterdayAge: return yesterdayAtTime
    case todayAge: return todayAtTime
    case tomorrowAge: return tomorrowAtTime
    default: throw new Error('Impossible')
  }
}

export function convertApiRailArrival (res: ApiRailArrivalResponse): RailArrival {
  const waitingTimeSeconds = parseInt(res.WAITING_SECONDS, 10)
  return {
    destination: res.DESTINATION,
    direction: convertRailDirection(res.DIRECTION),
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
