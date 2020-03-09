/* eslint-env mocha */
/* global moment, XHRMock, MockDate, expect, Marta */
describe('RealtimeRailApi', () => {
  beforeEach(() => XHRMock.setup())
  afterEach(() => XHRMock.teardown())

  beforeEach(() => MockDate.set(moment('2020-03-04 23:00:00.000-05:00').toDate()))
  afterEach(() => MockDate.reset())

  beforeEach(() => {
    XHRMock.get(/\/GetRealtimeArrivals/, {
      body: JSON.stringify([
        {
          DESTINATION: 'Indian Creek',
          DIRECTION: 'E',
          EVENT_TIME: '3/5/2020 1:27:23 AM',
          LINE: 'BLUE',
          NEXT_ARR: '01:27:50 AM',
          STATION: 'INMAN PARK STATION',
          TRAIN_ID: '108026',
          WAITING_SECONDS: '15',
          WAITING_TIME: 'Arriving'
        },
        {
          DESTINATION: 'Airport',
          DIRECTION: 'S',
          EVENT_TIME: '3/5/2020 1:27:15 AM',
          LINE: 'GOLD',
          NEXT_ARR: '01:35:30 AM',
          STATION: 'EAST POINT STATION',
          TRAIN_ID: '309506',
          WAITING_SECONDS: '475',
          WAITING_TIME: '7 min'
        }
      ])
    })
  })

  it('should return realtime rail info', () => {
    const marta = new Marta.RealtimeRailApi('<API-KEY>')
    return marta.getArrivals().then(function (results) {
      expect(results.length).to.equal(2)

      expect(results[0].destination).to.equal('Indian Creek')
      expect(results[0].direction).to.equal('East')
      expect(results[0].eventTime.toJSON()).to.equal('2020-03-05T06:27:23.000Z')
      expect(results[0].line).to.equal('BLUE')
      expect(results[0].nextArrival.toJSON()).to.equal('2020-03-05T06:27:50.000Z')
      expect(results[0].station).to.equal('INMAN PARK STATION')
      expect(results[0].trainId).to.equal('108026')
      expect(results[0].waitingTimeSeconds).to.equal(15)
      expect(results[0].waitingTime.toISOString()).to.equal('PT15S')
      expect(results[0].waitingState).to.equal('Arriving')

      expect(results[1].destination).to.equal('Airport')
      expect(results[1].direction).to.equal('South')
      expect(results[1].line).to.equal('GOLD')
      expect(results[1].station).to.equal('EAST POINT STATION')
      expect(results[1].trainId).to.equal('309506')
      expect(results[1].waitingTimeSeconds).to.equal(475)
      expect(results[1].waitingTime.toISOString()).to.equal('PT7M55S')
      expect(results[1].waitingState).to.equal('7 min')
    })
  })
  it('should return realtime rail info by station', () => {
    const marta = new Marta.RealtimeRailApi('<API-KEY>')
    return marta.getArrivalsForStation('INMAN PARK STATION').then(function (results) {
      expect(results.length).to.equal(1)

      expect(results[0].destination).to.equal('Indian Creek')
      expect(results[0].direction).to.equal('East')
      expect(results[0].eventTime.toJSON()).to.equal('2020-03-05T06:27:23.000Z')
      expect(results[0].line).to.equal('BLUE')
      expect(results[0].nextArrival.toJSON()).to.equal('2020-03-05T06:27:50.000Z')
      expect(results[0].station).to.equal('INMAN PARK STATION')
      expect(results[0].trainId).to.equal('108026')
      expect(results[0].waitingTimeSeconds).to.equal(15)
      expect(results[0].waitingTime.toISOString()).to.equal('PT15S')
      expect(results[0].waitingState).to.equal('Arriving')
    })
  })
})
