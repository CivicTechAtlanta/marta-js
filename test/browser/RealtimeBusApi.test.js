/* global XHRMock, expect, Marta */
/* eslint-env mocha */
describe('RealtimeBusApi', () => {
  beforeEach(() => XHRMock.setup())
  afterEach(() => XHRMock.teardown())

  it('should return realtime bus info', () => {
    XHRMock.get(/\/GetAllBus$/, {
      body: JSON.stringify([
        {
          ADHERENCE: '0',
          BLOCKID: '124',
          BLOCK_ABBR: '141-4',
          DIRECTION: 'Southbound',
          LATITUDE: '33.9453545',
          LONGITUDE: '-84.357408',
          MSGTIME: '3/5/2020 11:14:00 AM',
          ROUTE: '141',
          STOPID: '902649',
          TIMEPOINT: 'Deerfield Pkwy & Webb Rd',
          TRIPID: '7018640',
          VEHICLE: '7018'
        },
        {
          ADHERENCE: '-1',
          BLOCKID: '444',
          BLOCK_ABBR: '73-7',
          DIRECTION: 'Northbound',
          LATITUDE: '33.7525042',
          LONGITUDE: '-84.4691609',
          MSGTIME: '3/5/2020 11:14:25 AM',
          ROUTE: '73',
          STOPID: '903743',
          TIMEPOINT: 'Fulton Ind Blvd & MLK Jr Dr',
          TRIPID: '7051903',
          VEHICLE: '1675'
        }
      ])
    })
    const marta = new Marta.RealtimeBusApi()
    return marta.getArrivals().then(function (results) {
      expect(results.length).to.equal(2)
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
    })
  })

  it('should return realtime bus info by route', () => {
    XHRMock.get(/\/GetBusByRoute\/141$/, {
      body: JSON.stringify([
        {
          ADHERENCE: '0',
          BLOCKID: '124',
          BLOCK_ABBR: '141-4',
          DIRECTION: 'Southbound',
          LATITUDE: '33.9453545',
          LONGITUDE: '-84.357408',
          MSGTIME: '3/5/2020 11:14:00 AM',
          ROUTE: '141',
          STOPID: '902649',
          TIMEPOINT: 'Deerfield Pkwy & Webb Rd',
          TRIPID: '7018640',
          VEHICLE: '7018'
        }
      ])
    })
    const marta = new Marta.RealtimeBusApi()
    return marta.getArrivalsForRoute('141').then(function (results) {
      expect(results.length).to.equal(1)
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
    })
  })
})
