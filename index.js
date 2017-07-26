var request = require('request')
var moment = require('moment')

var REALTIME_TRAIN_ENDPOINT = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals'
var REALTIME_BUS_ALL_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus'
var REALTIME_BUS_ROUTE_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute'

function convertTrainArrival (arrival) {
  return {
    destination: arrival['DESTINATION'],
    direction: arrival['DIRECTION'],
    event_time: moment(arrival['EVENT_TIME'], 'M/D/YYYY h:mm:ss A'),
    line: arrival['LINE'],
    next_arr: moment(arrival['EVENT_TIME'], 'h:mm:ss A'),
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
    msg_time: moment(arrival['MSGTIME'], 'M/D/YYYY h:mm:ss A'),
    route: arrival['ROUTE'],
    stop_id: arrival['STOPID'],
    timepoint: arrival['TIMEPOINT'],
    trip_id: arrival['TRIPID'],
    vehicle: arrival['VEHICLE']
  }
}

function Api (apiKey) {
  this.apiKey = apiKey
}

Api.prototype.getRealtimeTrainArrivals = function (callback) {
  if (this.apiKey == null) {
    return callback(new Error('An API Key is required to use the realtime rail endpoint'), null)
  }
  request(REALTIME_TRAIN_ENDPOINT + '?apikey=' + this.apiKey, function (error, response, body) {
    if (error) {
      callback(error, null)
    } else {
      var arrivals = JSON.parse(body).map(convertTrainArrival)
      callback(null, arrivals)
    }
  })
}

Api.prototype.getAllRealtimeBusArrivals = function (callback) {
  request(REALTIME_BUS_ALL_ENDPOINT, function (error, response, body) {
    if (error) {
      callback(error, null)
    } else {
      var arrivals = JSON.parse(body).map(convertBusArrival)
      callback(null, arrivals)
    }
  })
}

Api.prototype.getRealtimeBusArrivalsByRoute = function (route, callback) {
  request(REALTIME_BUS_ROUTE_ENDPOINT + '/' + route, function (error, response, body) {
    if (error) {
      callback(error, null)
    } else {
      var arrivals = JSON.parse(body).map(convertBusArrival)
      callback(null, arrivals)
    }
  })
}

module.exports = Api
