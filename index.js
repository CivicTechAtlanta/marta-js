var request = require('request')
var moment = require('moment-timezone')
var promisify = require('./promisify')

var REALTIME_TRAIN_ENDPOINT = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals'
var REALTIME_BUS_ALL_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus'
var REALTIME_BUS_ROUTE_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute'

var TIMEZONE = 'America/New_York'

function convertTrainArrival (arrival) {
  return {
    destination: arrival['DESTINATION'],
    direction: arrival['DIRECTION'],
    event_time: moment.tz(arrival['EVENT_TIME'], 'M/D/YYYY h:mm:ss A', TIMEZONE),
    line: arrival['LINE'],
    next_arr: moment.tz(arrival['EVENT_TIME'], 'h:mm:ss A', TIMEZONE),
    station: arrival['STATION'],
    train_id: arrival['TRAIN_ID'],
    waiting_seconds: parseInt(arrival['WAITING_SECONDS'], 10),
    waiting_time: arrival['WAITING_TIME']
  }
}

function convertBusArrival (arrival) {
  return {
    adherence: parseInt(arrival['ADHERENCE'], 10),
    block_id: arrival['BLOCKID'],
    block_abbr: arrival['BLOCK_ABBR'],
    direction: arrival['DIRECTION'],
    latitude: parseFloat(arrival['LATITUDE']),
    longitude: parseFloat(arrival['LONGITUDE']),
    msg_time: moment.tz(arrival['MSGTIME'], 'M/D/YYYY h:mm:ss A', TIMEZONE),
    route: arrival['ROUTE'],
    stop_id: arrival['STOPID'],
    timepoint: arrival['TIMEPOINT'],
    trip_id: arrival['TRIPID'],
    vehicle: arrival['VEHICLE']
  }
}

function MartaApi (apiKey) {
  if (!(this instanceof MartaApi)) {
    return new MartaApi(apiKey)
  }
  this.apiKey = apiKey
}

MartaApi.prototype.getRealtimeTrainArrivals = function (callback) {
  return promisify(callback, function (resolve, reject) {
    if (this.apiKey == null) {
      return callback(new Error('An API Key is required to use the realtime rail endpoint'), null)
    }
    request(REALTIME_TRAIN_ENDPOINT + '?apikey=' + this.apiKey, function (error, response, body) {
      if (error) {
        return reject(error)
      }
      var arrivals = JSON.parse(body).map(convertTrainArrival)
      resolve(arrivals)
    })
  })
}

MartaApi.prototype.getAllRealtimeBusArrivals = function (callback) {
  return promisify(callback, function (resolve, reject) {
    request(REALTIME_BUS_ALL_ENDPOINT, function (error, response, body) {
      if (error) {
        return reject(error)
      }
      var arrivals = JSON.parse(body).map(convertBusArrival)
      resolve(arrivals)
    })
  })
}

MartaApi.prototype.getRealtimeBusArrivalsByRoute = function (route, callback) {
  return promisify(callback, function (resolve, reject) {
    if (route == null) {
      return reject(new Error('No route supplied'))
    }
    request(REALTIME_BUS_ROUTE_ENDPOINT + '/' + route, function (error, response, body) {
      if (error) {
        return reject(error)
      }
      var arrivals = JSON.parse(body).map(convertBusArrival)
      resolve(arrivals)
    })
  })
}

module.exports = MartaApi
