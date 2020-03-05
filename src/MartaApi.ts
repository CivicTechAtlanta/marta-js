import axios from 'axios'
import * as utils from './utils'

import { Callback } from './CommonTypes'
import { ApiBusArivalResponse, ApiRailArivalResponse } from './ApiTypes'
import { BusArival, BusRoute } from './BusTypes'
import { RailArrival, Station } from './RailTypes'

const REALTIME_RAIL_ENDPOINT = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals'
const REALTIME_BUS_ALL_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus'
const REALTIME_BUS_ROUTE_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute'

class MartaApi {
  private readonly apiKey: string | null

  constructor (apiKey?: string) {
    this.apiKey = apiKey || null
  }

  getRealtimeRailArrivals (callback?: Callback<RailArrival[]>): Promise<RailArrival[]> {
    return utils.applyCallback(callback, async () => {
      if (!this.apiKey) throw new Error('An API Key is required to use the realtime rail endpoint')
      const res: ApiRailArivalResponse[] = await this.request(REALTIME_RAIL_ENDPOINT)
      return res.map(r => utils.convertApiRailArival(r))
    })
  }

  getRealtimeRailArrivalsForStation (station: Station, callback?: Callback<RailArrival[]>): Promise<RailArrival[]> {
    return utils.applyCallback(callback, async () => {
      // there isn't a separate API for this, so we load all the data and filter for the user
      const allArivals = await this.getRealtimeRailArrivals()
      return allArivals.filter(a => a.station == station)
    })
  }

  getAllRealtimeBusArrivals (callback?: Callback<BusArival[]>): Promise<BusArival[]> {
    return utils.applyCallback(callback, async () => {
      const res: ApiBusArivalResponse[] = await this.request(REALTIME_BUS_ALL_ENDPOINT)
      return res.map(r => utils.convertApiBusArival(r))
    })
  }

  getAllRealtimeBusArrivalsByRoute (route: BusRoute, callback?: Callback<BusArival[]>): Promise<BusArival[]> {
    return utils.applyCallback(callback, async () => {
      const res: ApiBusArivalResponse[] = await this.request(`${REALTIME_BUS_ROUTE_ENDPOINT}/${route}`)
      return res.map(r => utils.convertApiBusArival(r))
    })
  }

  private request<T>(url: string): Promise<T> {
    return axios.get(url, { params: { apikey: this.apiKey } })
  }
}

export default MartaApi
export * from './CommonTypes'
export * from './BusTypes'
export * from './RailTypes'
