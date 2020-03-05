import { Callback, Moment } from './CommonTypes';
import { ApiBusArrivalResponse, ApiRailArrivalResponse } from './ApiTypes';
import { BusArrival } from './BusTypes';
import { RailArrival } from './RailTypes';
export declare function applyCallback<T>(callback: Callback<T> | undefined, method: () => Promise<T>): Promise<T>;
export declare function convertApiDateTimeFormat(formattedTime: string): Moment;
export declare function convertApiBusArrival(res: ApiBusArrivalResponse): BusArrival;
export declare function convertNextArrivalTime(arrivalTime: string): Moment;
export declare function convertApiRailArrival(res: ApiRailArrivalResponse): RailArrival;
