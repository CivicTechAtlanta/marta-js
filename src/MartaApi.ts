import axios from 'axios'
import * as utils from './utils'

import { Callback } from './CommonTypes'
import { ApiBusArrivalResponse, ApiRailArrivalResponse } from './ApiTypes'
import { BusArrival, BusRoute } from './BusTypes'
import { RailArrival, Station } from './RailTypes'

const REALTIME_RAIL_ENDPOINT = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals'
const REALTIME_BUS_ALL_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus'
const REALTIME_BUS_ROUTE_ENDPOINT = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute'

export class MartaApi {
  private readonly apiKey: string | null

  constructor (apiKey?: string) {
    this.apiKey = apiKey ?? null
  }

  async getRealtimeRailArrivals (callback?: Callback<RailArrival[]>): Promise<RailArrival[]> {
    return utils.applyCallback(callback, async () => {
      if (this.apiKey === null) throw new Error('An API Key is required to use the realtime rail endpoint')
      const res: ApiRailArrivalResponse[] = await this.request(REALTIME_RAIL_ENDPOINT)
      return res.map(r => utils.convertApiRailArrival(r))
    })
  }

  async getRealtimeRailArrivalsForStation (station: Station, callback?: Callback<RailArrival[]>): Promise<RailArrival[]> {
    return utils.applyCallback(callback, async () => {
      // there isn't a separate API for this, so we load all the data and filter for the user
      const allArrivals = await this.getRealtimeRailArrivals()
      return allArrivals.filter(a => a.station === station)
    })
  }

  async getAllRealtimeBusArrivals (callback?: Callback<BusArrival[]>): Promise<BusArrival[]> {
    return utils.applyCallback(callback, async () => {
      const res: ApiBusArrivalResponse[] = await this.request(REALTIME_BUS_ALL_ENDPOINT)
      return res.map(r => utils.convertApiBusArrival(r))
    })
  }

  async getAllRealtimeBusArrivalsByRoute (route: BusRoute, callback?: Callback<BusArrival[]>): Promise<BusArrival[]> {
    return utils.applyCallback(callback, async () => {
      const res: ApiBusArrivalResponse[] = await this.request(`${REALTIME_BUS_ROUTE_ENDPOINT}/${route}`)
      return res.map(r => utils.convertApiBusArrival(r))
    })
  }

  private async request<T> (url: string): Promise<T> {
    const params = this.apiKey === null ? {} : { apikey: this.apiKey }
    const res = await axios.get(url, { params })
    return res.data
  }
}
