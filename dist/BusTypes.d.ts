/// <reference types="moment" />
import { Moment, Duration, Direction } from './CommonTypes';
export interface BusArrival {
    adherence: Duration;
    blockId: string;
    blockAbbriviation: string;
    direction: Direction;
    latitude: number;
    longitude: number;
    eventTime: Moment;
    route: BusRoute;
    stopId: string;
    timepoint: string;
    tripId: string;
    busId: string;
}
export declare type BusRoute = '1' | '2' | '3' | '4' | '5' | '6' | '8' | '9' | '12' | '14' | '15' | '19' | '21' | '24' | '25' | '26' | '27' | '30' | '32' | '34' | '36' | '37' | '39' | '40' | '42' | '47' | '49' | '50' | '51' | '55' | '58' | '60' | '66' | '68' | '71' | '73' | '74' | '75' | '78' | '79' | '81' | '82' | '83' | '84' | '85' | '86' | '87' | '89' | '93' | '94' | '95' | '102' | '103' | '104' | '107' | '110' | '111' | '114' | '115' | '116' | '117' | '119' | '120' | '121' | '123' | '124' | '125' | '126' | '132' | '133' | '140' | '141' | '142' | '143' | '148' | '150' | '153' | '155' | '162' | '165' | '172' | '178' | '180' | '181' | '183' | '185' | '186' | '189' | '191' | '192' | '193' | '194' | '195' | '196' | '201' | '221' | '295' | '800' | '809' | '813' | '816' | '823' | '825' | '832' | '850' | '853' | '856' | '865' | '867' | '899';
