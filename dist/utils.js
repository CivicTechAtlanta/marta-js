"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_timezone_1 = __importDefault(require("moment-timezone"));
function applyCallback(callback, method) {
    return __awaiter(this, void 0, void 0, function () {
        var promise;
        return __generator(this, function (_a) {
            promise = method();
            if (typeof callback !== 'undefined') {
                promise.then(function (res) { return callback(null, res); }).catch(function (err) { return callback(err, null); });
            }
            return [2 /*return*/, promise];
        });
    });
}
exports.applyCallback = applyCallback;
var TIMEZONE = 'America/New_York';
var TIME_FORMAT = 'M/D/YYYY h:mm:ss A';
function convertApiDateTimeFormat(formattedTime) {
    return moment_timezone_1.default.tz(formattedTime, TIME_FORMAT, TIMEZONE);
}
exports.convertApiDateTimeFormat = convertApiDateTimeFormat;
function convertBusDirection(apiDirection) {
    switch (apiDirection) {
        case 'Northbound': return 'North';
        case 'Southbound': return 'South';
        case 'Eastbound': return 'East';
        case 'Westbound': return 'West';
    }
}
function convertApiBusArrival(res) {
    return {
        adherence: moment_timezone_1.default.duration(parseInt(res.ADHERENCE, 10), 'minutes'),
        blockId: res.BLOCKID,
        blockAbbriviation: res.BLOCK_ABBR,
        direction: convertBusDirection(res.DIRECTION),
        latitude: parseFloat(res.LATITUDE),
        longitude: parseFloat(res.LONGITUDE),
        eventTime: convertApiDateTimeFormat(res.MSGTIME),
        route: res.ROUTE,
        stopId: res.STOPID,
        timepoint: res.TIMEPOINT,
        tripId: res.TRIPID,
        busId: res.VEHICLE
    };
}
exports.convertApiBusArrival = convertApiBusArrival;
function convertRailDirection(apiDirection) {
    switch (apiDirection) {
        case 'N': return 'North';
        case 'S': return 'South';
        case 'E': return 'East';
        case 'W': return 'West';
    }
}
// arrival time comes in just a time, like "09:44:46 PM"
// to convert to a moment, we need to find the next point
// in the future where it is that time (not necessarily today,
// since times roll over at midnight)
function convertNextArrivalTime(arrivalTime) {
    var now = moment_timezone_1.default.tz(TIMEZONE);
    var yesterdayDate = now.clone().subtract(1, 'day').format('M/D/YYYY');
    var todayDate = now.format('M/D/YYYY');
    var tomrrowDate = now.clone().add(1, 'day').format('M/D/YYYY');
    var yesterdayAtTime = convertApiDateTimeFormat(yesterdayDate + " " + arrivalTime);
    var todayAtTime = convertApiDateTimeFormat(todayDate + " " + arrivalTime);
    var tomorrowAtTime = convertApiDateTimeFormat(tomrrowDate + " " + arrivalTime);
    // select the closest to the current time
    var yesterdayAge = Math.abs(now.diff(yesterdayAtTime));
    var todayAge = Math.abs(now.diff(todayAtTime));
    var tomorrowAge = Math.abs(now.diff(tomorrowAtTime));
    switch (Math.min(yesterdayAge, todayAge, tomorrowAge)) {
        case yesterdayAge: return yesterdayAtTime;
        case todayAge: return todayAtTime;
        case tomorrowAge: return tomorrowAtTime;
        default: throw new Error('Impossible');
    }
}
exports.convertNextArrivalTime = convertNextArrivalTime;
function convertApiRailArrival(res) {
    var waitingTimeSeconds = parseInt(res.WAITING_SECONDS, 10);
    return {
        destination: res.DESTINATION,
        direction: convertRailDirection(res.DIRECTION),
        eventTime: convertApiDateTimeFormat(res.EVENT_TIME),
        line: res.LINE,
        nextArrival: convertNextArrivalTime(res.NEXT_ARR),
        station: res.STATION,
        trainId: res.TRAIN_ID,
        waitingTimeSeconds: waitingTimeSeconds,
        waitingTime: moment_timezone_1.default.duration(waitingTimeSeconds, 'seconds'),
        waitingState: res.WAITING_TIME
    };
}
exports.convertApiRailArrival = convertApiRailArrival;
//# sourceMappingURL=utils.js.map