import moment, { Moment } from 'moment-timezone'

export type Callback<T> = (error: Error | null, result: null | T) => void
export type Direction = 'North' | 'South' | 'East' | 'West'

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
