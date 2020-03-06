const expect = require('chai').expect
const MockDate = require('mockdate')
const moment = require('moment-timezone')
const VCR = require('axios-vcr')

const RealtimeRailApi = require('../dist').RealtimeRailApi

describe('RealtimeRailApi', () => {
  const marta = new RealtimeRailApi(process.env.API_KEY)

  beforeEach(() => MockDate.set(moment('2020-03-04 23:00:00.000-05:00').toDate()))
  afterEach(() => MockDate.reset())

  beforeEach(() => VCR.mountCassette('./test/fixtures/realtimeRail/getArrivals.json'))
  afterEach(() => VCR.ejectCassette('./test/fixtures/realtimeRail/getArrivals.json'))

  it('should require an api key', () => {
    expect(() => new RealtimeRailApi()).to.throw(/API Key is required/)
  })

  describe('getArrivals', () => {
    it('should support promise form', async () => {
      const results = await marta.getArrivals()
      expect(results.length).to.equal(51)
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

      expect(results[18].destination).to.equal('Airport')
      expect(results[18].direction).to.equal('South')
      expect(results[18].line).to.equal('GOLD')
      expect(results[18].station).to.equal('EAST POINT STATION')
      expect(results[18].trainId).to.equal('309506')
      expect(results[18].waitingTimeSeconds).to.equal(475)
      expect(results[18].waitingTime.toISOString()).to.equal('PT7M55S')
      expect(results[18].waitingState).to.equal('7 min')
    })

    it('should support callback form', (done) => {
      marta.getArrivals((err, results) => {
        try {
          expect(err).to.equal(null)
          expect(results).not.to.equal(null)
          expect(results.length).to.equal(51)
          done()
        } catch (e) {
          done(e)
        }
      })
    })
  })

  describe('getArrivalsForStation', () => {
    it('should support promise form', async () => {
      const results = await marta.getArrivalsForStation('MIDTOWN STATION')
      expect(results.length).to.equal(2)

      for (const result of results) {
        expect(result.station).to.equal('MIDTOWN STATION')
      }

      expect(results[0].destination).to.equal('Doraville')
      expect(results[0].direction).to.equal('North')
      expect(results[0].line).to.equal('GOLD')
    })

    it('should support callback form', (done) => {
      marta.getArrivalsForStation('MIDTOWN STATION', (err, results) => {
        try {
          expect(err).to.equal(null)
          expect(results).not.to.equal(null)
          expect(results.length).to.equal(2)
          done()
        } catch (e) {
          done(e)
        }
      })
    })
  })
})
