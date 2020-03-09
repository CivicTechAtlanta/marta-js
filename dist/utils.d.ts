import { Moment } from 'moment-timezone';
export declare type Callback<T> = (error: Error | null, result: null | T) => void;
export declare type Direction = 'North' | 'South' | 'East' | 'West';
export declare function applyCallback<T>(callback: Callback<T> | undefined, method: () => Promise<T>): Promise<T>;
export declare function convertApiDateTimeFormat(formattedTime: string): Moment;
export declare function convertNextArrivalTime(arrivalTime: string): Moment;
//# sourceMappingURL=utils.d.ts.map