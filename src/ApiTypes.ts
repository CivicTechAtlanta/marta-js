export type ApiBusDirection = 'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound'

/*
  {
    "ADHERENCE": "-23",
    "BLOCKID": "315",
    "BLOCK_ABBR": "30-9",
    "DIRECTION": "Eastbound",
    "LATITUDE": "33.8455188",
    "LONGITUDE": "-84.2512385",
    "MSGTIME": "3/4/2020 8:33:18 PM",
    "ROUTE": "30",
    "STOPID": "902040",
    "TIMEPOINT": "LaVista Rd & Oak Grove Rd",
    "TRIPID": "7025856",
    "VEHICLE": "1410"
  }
*/
export type ApiBusArivalResponse = {
  ADHERENCE: string
  BLOCKID: string
  BLOCK_ABBR: string
  DIRECTION: ApiBusDirection
  LATITUDE: string
  LONGITUDE: string
  MSGTIME: string
  ROUTE: string
  STOPID: string
  TIMEPOINT: string
  TRIPID: string
  VEHICLE: string
}

export type ApiRailDirection = 'N' | 'S' | 'E' | 'W'

/*
  {
    "DESTINATION": "North Springs",
    "DIRECTION": "N",
    "EVENT_TIME": "3/4/2020 9:44:36 PM",
    "LINE": "RED",
    "NEXT_ARR": "09:44:46 PM",
    "STATION": "BUCKHEAD STATION",
    "TRAIN_ID": "408306",
    "WAITING_SECONDS": "-32",
    "WAITING_TIME": "Boarding" // or "Arriving" or  "3 min"
  }
*/
export type ApiRailArivalResponse = {
  DESTINATION: string
  DIRECTION: ApiRailDirection
  EVENT_TIME: string
  LINE: 'RED' | 'GOLD' | 'BLUE' | 'GREEN'
  NEXT_ARR: string
  STATION: string
  TRAIN_ID: string
  WAITING_SECONDS: string
  WAITING_TIME: 'Boarding' | 'Arriving' | string
}
