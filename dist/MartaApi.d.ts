import { Callback } from './CommonTypes';
import { BusArrival, BusRoute } from './BusTypes';
import { RailArrival, Station } from './RailTypes';
export declare class MartaApi {
    private readonly apiKey;
    constructor(apiKey?: string);
    getRealtimeRailArrivals(callback?: Callback<RailArrival[]>): Promise<RailArrival[]>;
    getRealtimeRailArrivalsForStation(station: Station, callback?: Callback<RailArrival[]>): Promise<RailArrival[]>;
    getAllRealtimeBusArrivals(callback?: Callback<BusArrival[]>): Promise<BusArrival[]>;
    getAllRealtimeBusArrivalsByRoute(route: BusRoute, callback?: Callback<BusArrival[]>): Promise<BusArrival[]>;
    private request;
}
