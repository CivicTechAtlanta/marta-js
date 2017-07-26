var request = require('request');
var moment = require('moment');

var REALTIME_TRAIN_ENDPOINT = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals'

module.exports.getRealtimeTrainArrivals = function (apiKey, callback) {
  request(REALTIME_TRAIN_ENDPOINT + '?apikey=' + apiKey, function (error, response, body) {
    if (error) {
      callback(error, null);
    } else {
      var arrivals = JSON.parse(body).map(function (arrival) {
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
      });
      callback(null, arrivals);
    }
  });
}

