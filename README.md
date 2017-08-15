
# Introduction

An API key is only required for the realtime Rail API. The realtime Bus API does not require an API key. You can request an API key from the [Marta Key Registration site](http://www.itsmarta.com/developer-reg-rtt.aspx).

Get additional documentation on the data from the [MARTA Developer Resources site](http://www.itsmarta.com/app-developer-resources.aspx).

# Field Definitions

## Bus
* adherence
Identifies the current time of arrival compared to scheduled arrival time. Positive number indicates bus is running x minutes late. Negative number indicates bus is running x minutes early.

* direction
Direction the bus is headed to (i.e. Northbound).

* latitude
Current latitude of Bus.

* longitude
Current longitude of Bus.

* msg_time
Time of last update?

* route
Name of the bus route (i.e. 12).

## Train
* destination
Destination of train (i.e. Airport)

* direction
Direction of train (i.e. S)

* event_time
Time of last update?

* line
Name of the train line (i.e. GOLD)

* next_arr
Time of the next train arrival.

* station
Name of the station (i.e. AIRPORT STATION)

* train_id
Train identifier number (i.e. 303506)

* waiting_seconds
?

* waiting_time
?


# Usage

    npm install --save marta-js

```js
  var MartaApi = require('marta-js')
  var marta = new MartaApi('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') // your API key

  // callback form
  marta.getRealtimeTrainArrivals(function (error, arrivals) {
    /*
      arrivals is an array of objects like:
      {
        destination: 'Airport',
        direction: 'S',
        event_time: moment("2017-07-25T21:45:42.000"),
        line: 'GOLD',
        next_arr: moment("2017-07-25T19:45:42.000"),
        station: 'AIRPORT STATION',
        train_id: '303506',
        waiting_seconds: 1608,
        waiting_time: '26 min'
      }
    */
  })

  // if your platform supports promises, you can use them instead of callbacks:
  marta.getRealtimeTrainArrivals().then(function (arrivals) {
    // ...
  }).catch(function (err) {
    // ...
  })

  // same for bus arrivals:
  marta.getAllRealtimeBusArrivals(function (error, arrivals) {
    /*
      arrivals is an array of objects like:
      {
        adherence: -2,
        block_id: '82',
        block_abbr: '12-10',
        direction: 'Northbound',
        latitude: 33.8206244,
        longitude: -84.4163082,
        msg_time: moment("2017-07-25T21:46:12.000"),
        route: '12',
        stop_id: '901718',
        timepoint: 'Howell Mill Rd at Trabert Ave NW',
        trip_id: '5572278',
        vehicle: '1453'
      }
    */
  })

  // bus arrivals can also be requested only for a particular route:
  marta.getRealtimeBusArrivalsByRoute(21, function (error, arrivals) { ... })
```


### License

[MIT](LICENSE)
