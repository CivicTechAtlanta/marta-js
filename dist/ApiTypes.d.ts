export declare type ApiBusDirection = 'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound';
export interface ApiBusArrivalResponse {
    ADHERENCE: string;
    BLOCKID: string;
    BLOCK_ABBR: string;
    DIRECTION: ApiBusDirection;
    LATITUDE: string;
    LONGITUDE: string;
    MSGTIME: string;
    ROUTE: string;
    STOPID: string;
    TIMEPOINT: string;
    TRIPID: string;
    VEHICLE: string;
}
export declare type ApiRailDirection = 'N' | 'S' | 'E' | 'W';
export interface ApiRailArrivalResponse {
    DESTINATION: string;
    DIRECTION: ApiRailDirection;
    EVENT_TIME: string;
    LINE: 'RED' | 'GOLD' | 'BLUE' | 'GREEN';
    NEXT_ARR: string;
    STATION: string;
    TRAIN_ID: string;
    WAITING_SECONDS: string;
    WAITING_TIME: 'Boarding' | 'Arriving' | string;
}
