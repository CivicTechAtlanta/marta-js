/// <reference types="moment" />
import { Moment, Duration } from 'moment-timezone';
import { Callback, Direction } from './utils';
export interface BusArrival {
    adherence: Duration;
    blockId: string;
    blockAbbriviation: string;
    direction: Direction;
    latitude: number;
    longitude: number;
    eventTime: Moment;
    route: string;
    stopId: string;
    timepoint: string;
    tripId: string;
    busId: string;
}
export declare class RealtimeBusApi {
    getArrivals(callback?: Callback<BusArrival[]>): Promise<BusArrival[]>;
    getArrivalsForRoute(route: string, callback?: Callback<BusArrival[]>): Promise<BusArrival[]>;
    private request;
    private convertBusDirection;
    private convertResponse;
}
