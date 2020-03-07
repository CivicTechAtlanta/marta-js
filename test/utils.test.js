const expect = require('chai').expect
const MockDate = require('mockdate')
const moment = require('moment-timezone')

const utils = require('../src/utils')

describe('utils', () => {
  afterEach(() => MockDate.reset())

  describe('convertApiDateTimeFormat', () => {
    it('should parse the MARTA format date to a Moment in the right time zone', () => {
      const t = utils.convertApiDateTimeFormat('3/4/2020 8:34:30 PM')
      expect(t.toString()).to.equal('Wed Mar 04 2020 20:34:30 GMT-0500')
      expect(t.zoneName()).to.equal('EST')
      expect(t.toJSON()).to.equal('2020-03-05T01:34:30.000Z')
    })
  })

  describe('convertNextArrivalTime', () => {
    for (const timezone of ['America/New_York', 'America/Los_Angeles', 'Etc/GMT']) {
      context(`when code running in time zone ${timezone}`, () => {
        const timezoneOffset = moment.tz(timezone).utcOffset()

        it('should convert an arrival time to a moment', () => {
          // 1:30pm eastern time
          MockDate.set(moment('2020-03-04 13:30:00.000-05:00').toDate(), timezoneOffset)
          const justAhead = utils.convertNextArrivalTime('01:35:30 PM')
          expect(justAhead.toString()).to.equal('Wed Mar 04 2020 13:35:30 GMT-0500')
          expect(justAhead.zoneName()).to.equal('EST')
          expect(justAhead.toJSON()).to.equal('2020-03-04T18:35:30.000Z')

          const justBehind = utils.convertNextArrivalTime('01:05:45 PM')
          expect(justBehind.toString()).to.equal('Wed Mar 04 2020 13:05:45 GMT-0500')
          expect(justBehind.zoneName()).to.equal('EST')
          expect(justBehind.toJSON()).to.equal('2020-03-04T18:05:45.000Z')

          // just before midnight eastern time
          MockDate.set(moment('2020-03-04 23:55:00.000-05:00').toDate(), timezoneOffset)
          const nextDay = utils.convertNextArrivalTime('01:05:15 AM')
          expect(nextDay.toString()).to.equal('Thu Mar 05 2020 01:05:15 GMT-0500')
          expect(nextDay.zoneName()).to.equal('EST')
          expect(nextDay.toJSON()).to.equal('2020-03-05T06:05:15.000Z')

          // just after midnight eastern time
          MockDate.set(moment('2020-03-05 00:05:00.000-05:00').toDate(), timezoneOffset)
          const previousDay = utils.convertNextArrivalTime('11:55:15 PM')
          expect(previousDay.toString()).to.equal('Wed Mar 04 2020 23:55:15 GMT-0500')
          expect(previousDay.zoneName()).to.equal('EST')
          expect(previousDay.toJSON()).to.equal('2020-03-05T04:55:15.000Z')
        })
      })
    }
  })
})
