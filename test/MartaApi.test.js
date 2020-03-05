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
        expect(err).to.equal(null)
        expect(results).not.to.equal(null)
        expect(results.length).to.equal(51)
        done()
      })
    })
  })
})
