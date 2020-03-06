const expect = require('chai').expect
const VCR = require('axios-vcr')

const RealtimeBusApi = require('../dist').RealtimeBusApi

describe('RealtimeBusApi', () => {
  const marta = new RealtimeBusApi()

  describe('getArrivals', () => {
    beforeEach(() => VCR.mountCassette('./test/fixtures/realtimeBus/getArrivals.json'))
    afterEach(() => VCR.ejectCassette('./test/fixtures/realtimeBus/getArrivals.json'))

    it('should support promise form', async () => {
      const results = await marta.getArrivals()
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
      marta.getArrivals((err, results) => {
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

  describe('getArrivalsForRoute', () => {
    beforeEach(() => VCR.mountCassette('./test/fixtures/realtimeBus/getArrivalsForRoute.json'))
    afterEach(() => VCR.ejectCassette('./test/fixtures/realtimeBus/getArrivalsForRoute.json'))

    it('should support promise form', async () => {
      const results = await marta.getArrivalsForRoute('21')
      expect(results.length).to.equal(4)

      for (const result of results) {
        expect(result.route).to.equal('21')
      }
    })

    it('should support callback form', (done) => {
      marta.getArrivalsForRoute('21', (err, results) => {
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
