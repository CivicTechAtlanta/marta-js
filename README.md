# Marta.js

This library is a wrapper for the
[MARTA Realtime RESTful APIs](https://www.itsmarta.com/app-developer-resources.aspx).

Because the documentation of the upstream APIs is limited, this library alters some naming
conventions from what the API
returns in an effort to make the data easier to understand.

It uses [moment](https://momentjs.com/docs) for times and durations, and it's written in TypeScript
to aid in defining data structures.

You can [request an API key from MARTA](https://www.itsmarta.com/developer-reg-rtt.aspx) to use for
the Realtime Rail data. The Realtime Bus data does not require an API key.

## Usage

    npm install --save marta-js

### CommonJS import

```js
const MartaApi = require('marta-js').MartaApi
const marta = new MartaApi('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') // your API key
```

### ES6 import

```js
import { MartaApi } from 'marta-js'
const marta = new MartaApi('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') // your API key
```

### Promises vs Callbacks

All methods support both promises and callbacks.

Promise mode:

```js
marta.getRealtimeTrainArrivals().then(function (arrival) {
  // ...
}).catch(function (error) { console.error(error) })
```

Callback mode:

```js
marta.getRealtimeTrainArrivals(function (error, arrival) {
  if (error) {
    console.error(error)
  } else {
    // ...
  }
})
```

This library depends on a native ES6 Promise implementation to be
[supported](http://caniuse.com/promises). If your environment doesn't support ES6 Promises,
for example older browsers, you can [polyfill](https://github.com/jakearchibald/es6-promise).

For example:

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script> 
<script src="./node_modules/marta-js/dist/marta.js"></script> 
```

## Methods

### `getRealtimeTrainArrivals`

This is the same data that powers the realtime train time monitors in the station. For all stations,
it will tell you how long until the next several trains arrive.

```js
const MartaApi = require('marta-js').MartaApi
const marta = new MartaApi('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')

marta.getRealtimeTrainArrivals(function (error, arrivals) {
  /*
    Definition:
    type RailArrival = {
      destination: string
      direction: 'North' | 'South' | 'East' | 'West'
      eventTime: Moment
      line: 'RED' | 'GOLD' | 'GREEN' | 'BLUE'
      nextArrival: Moment
      station: Station
      trainId: string
      waitingTimeSeconds: number
      waitingTime: Moment.Duration
      waitingState: 'Boarding' | 'Arriving' | string
    }
    Example:
    {
      destination: 'Airport',
      direction: 'South',
      eventTime: moment("2017-07-25T21:45:42.000"),
      line: 'GOLD',
      nextArrival: moment("2017-07-25T19:45:42.000"),
      station: 'AIRPORT STATION',
      trainId: '303506',
      waitingTimeSeconds: 1608,
      waitingTime: moment.duration(1608, 'seconds'),
      waitingState: '26 min'
    }
  */
})
```

### `getRealtimeRailArrivalsForStation`

This is the same as `getRealtimeTrainArrivals`, but filtered to only the specified station.

```js
const MartaApi = require('marta-js')
const marta = new MartaApi('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')

marta.getRealtimeRailArrivalsForStation('FIVE POINTS STATION', function (error, arrivals) {
  // ...
})
```

### `getAllRealtimeBusArrivals`

This API returns the lastest location update from each bus, it's route, and if it is on-time.
"Adherance" is how well it is adhering to the schedule. It's a measure of lateness (early is negative).

```js
const MartaApi = require('marta-js')
const marta = new MartaApi()
marta.getAllRealtimeBusArrivals(function (error, arrivals) {
  /*
    Definition:
    type BusArrival = {
      adherence: Moment.Duration
      blockId: string
      blockAbbriviation: string
      direction: 'North' | 'South' | 'East' | 'West'
      latitude: number
      longitude: number
      eventTime: Moment
      route: BusRoute
      stopId: string
      timepoint: string
      tripId: string
      busId: string
    }
    Example:
    {
      adherence: moment.duration(-2, 'minutes'),
      blockId: '82',
      blockAbbriviation: '12-10',
      direction: 'North',
      latitude: 33.8206244,
      longitude: -84.4163082,
      eventTime: moment("2017-07-25T21:46:12.000"),
      route: '12',
      stopId: '901718',
      timepoint: 'Howell Mill Rd at Trabert Ave NW',
      tripId: '5572278',
      busId: '1453'
    }
  */
})
```

### `getAllRealtimeBusArrivalsByRoute`

This is the same as `getAllRealtimeBusArrivals`, but filtered to only the specified route.

```js
const MartaApi = require('marta-js')
const marta = new MartaApi()
marta.getAllRealtimeBusArrivalsByRoute('12', function (error, arrivals) {
  // ...
})
```
