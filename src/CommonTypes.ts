export { Moment, Duration } from 'moment-timezone'
export type Callback<T> = (error: Error | null, result: null | T) => void

export type Direction = 'North' | 'South' | 'East' | 'West'
