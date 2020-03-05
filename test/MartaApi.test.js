const expect = require('chai').expect
const VCR = require('axios-vcr')

const MartaApi = require('../dist').MartaApi

describe('MartaApi', () => {
  const marta = new MartaApi(process.env.API_KEY)

  describe('getRealtimeRailArrivals', () => {
    beforeEach(() => VCR.mountCassette('./test/fixtures/getRealtimeRailArrivals.json'))
    afterEach(() => VCR.ejectCassette('./test/fixtures/getRealtimeRailArrivals.json'))

    it('should support promise form', async () => {
      const results = await marta.getRealtimeRailArrivals()
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
      marta.getRealtimeRailArrivals((err, results) => {
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

    it('should require an api key', () => {
      expect(new MartaApi().getAllRealtimeBusArrivals()).to.eventually.throw(/API Key is required/)
    })
  })

  describe('getRealtimeRailArrivalsForStation', () => {
    beforeEach(() => VCR.mountCassette('./test/fixtures/getRealtimeRailArrivals.json'))
    afterEach(() => VCR.ejectCassette('./test/fixtures/getRealtimeRailArrivals.json'))

    it('should support promise form', async () => {
      const results = await marta.getRealtimeRailArrivalsForStation('MIDTOWN STATION')
      expect(results.length).to.equal(2)

      for (const result of results) {
        expect(result.station).to.equal('MIDTOWN STATION')
      }

      expect(results[0].destination).to.equal('Doraville')
      expect(results[0].direction).to.equal('North')
      expect(results[0].line).to.equal('GOLD')
    })

    it('should support callback form', (done) => {
      marta.getRealtimeRailArrivalsForStation('MIDTOWN STATION', (err, results) => {
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

    it('should require an api key', () => {
      expect(new MartaApi().getAllRealtimeBusArrivals()).to.eventually.throw(/API Key is required/)
    })
  })

  describe('getAllRealtimeBusArrivals', () => {
    beforeEach(() => VCR.mountCassette('./test/fixtures/getAllRealtimeBusArrivals.json'))
    afterEach(() => VCR.ejectCassette('./test/fixtures/getAllRealtimeBusArrivals.json'))

    it('should support promise form', async () => {
      const results = await marta.getAllRealtimeBusArrivals()
      expect(results.length).to.equal(277)

      expect(results[0].adherence.asSeconds()).to.equal(0)
      expect(results[0].blockId).to.equal('124')
      expect(results[0].blockAbbriviation).to.equal('141-4')
      expect(results[0].direction).to.equal('South')
      expect(results[0].latitude).to.equal(33.9453545)
      expect(results[0].longitude).to.equal(-84.357408)
      expect(results[0].eventTime.toJSON()).to.equal('2020-03-05T16:14:00.000Z')
      expect(results[0].route).to.equal('141')
      expect(results[0].stopId).to.equal('902649')
      expect(results[0].timepoint).to.equal('Deerfield Pkwy & Webb Rd')
      expect(results[0].tripId).to.equal('7018640')
      expect(results[0].busId).to.equal('7018')

      // positive 4 minutes means its 4 minutes ahead
      expect(results[3].adherence.toISOString()).to.equal('PT4M')
    })

    it('should support callback form', (done) => {
      marta.getAllRealtimeBusArrivals((err, results) => {
        try {
          expect(err).to.equal(null)
          expect(results).not.to.equal(null)
          expect(results.length).to.equal(277)
          done()
        } catch (e) {
          done(e)
        }
      })
    })
  })

  describe('getAllRealtimeBusArrivalsByRoute', () => {
    beforeEach(() => VCR.mountCassette('./test/fixtures/getAllRealtimeBusArrivalsByRoute.json'))
    afterEach(() => VCR.ejectCassette('./test/fixtures/getAllRealtimeBusArrivalsByRoute.json'))

    it('should support promise form', async () => {
      const results = await marta.getAllRealtimeBusArrivalsByRoute('21')
      expect(results.length).to.equal(4)

      for (const result of results) {
        expect(result.route).to.equal('21')
      }
    })

    it('should support callback form', (done) => {
      marta.getAllRealtimeBusArrivalsByRoute('21', (err, results) => {
        try {
          expect(err).to.equal(null)
          expect(results).not.to.equal(null)
          expect(results.length).to.equal(4)
          done()
        } catch (e) {
          done(e)
        }
      })
    })
  })
})
