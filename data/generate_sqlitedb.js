/* global Promise */
const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const Transform = require('stream').Transform
const mkdirp = require('mkdirp')
const request = require('request')
const Sequelize = require('sequelize')
// const csv = require('csv-streamify')
const etl = require('etl')

const loadModels = require('gtfs-sequelize/models')
const GTFS_URL = 'http://www.itsmarta.com/google_transit_feed/google_transit.zip'

function MartaGTFS (opts) {
  if (!(this instanceof MartaGTFS)) {
    return new MartaGTFS(opts)
  }
  // configure default options
  opts = opts || {}
  opts.path = opts.path || './google_transit.zip'
  opts.force = opts.force || false
  opts.minAge = opts.minAge || (60 * 24 * 60 * 60 * 1000) // 60 days in ms
  opts.database = opts.database || 'sqlite://gtfs.db'
  opts.sequelizeOptions = opts.sequelizeOptions || {}
  opts.sequelizeOptions.logging = opts.sequelizeOptions.logging || false
  this.opts = opts
  Object.assign(this, loadModels(opts.database, opts.sequelizeOptions))
}

function zipFileLastModified (path) {
  return Sequelize.Promise.promisify(fs.stat)(path)
  .then(stats => stats.mtimeMs)
  .catch(err => {
    if (err.code === 'ENOENT') {
      return null // the file does not exist yet
    }
    throw err // otherwise rethrow
  })
}

function tableNameFromFileName (fileName) {
  const base = path.basename(fileName, '.txt')
  if (base === 'frequencies') {
    return 'frequency'
  } else if (base === 'agencies') {
    return 'agency'
  } else {
    return base.substring(0, base.length - 1) // remove 's'
  }
}

// https://stackoverflow.com/a/33511005/1539043
function trimObj (obj) {
  if (!Array.isArray(obj) && typeof obj !== 'object') return obj
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.trim()] = typeof obj[key] === 'string' ? obj[key].trim() : trimObj(obj[key])
    return acc
  }, Array.isArray(obj) ? [] : {})
}

function createTableStream (gtfs) {
  return new Transform({
    objectMode: true,
    transform: (entry, encoding, callback) => {
      // for each discovered entry in the zip file
      const fileName = entry.path
      const model = gtfs[tableNameFromFileName(fileName)]
      // if a table doesn't exist for it, skip it
      if (model == null) {
        console.log('skipping', fileName)
        entry.autodrain()
        callback()
      } else {
        // read the entry as a csv
        console.log('reading', fileName)
        entry
          // .pipe(csv({newline: '\r\n', objectMode: true, columns: true}))
          .pipe(etl.csv({ newline: '\r\n' }))
          .pipe(etl.map(item => trimObj(item)))
          .pipe(etl.collect(1000)) // collect 1000 records at a time for bulk-insert
          // insert each row into the database
          .pipe(etl.map(data => {
            model.bulkCreate(data).catch(err => {
              console.error('error', err, data)
              throw err
            })
          }))
          // .pipe(new Transform({
          //   objectMode: true,
          //   highWaterMark: 1000, // allow up to 100 records in buff
          //   transform: (data, encoding, callback) => {
          //     console.log('inserting', data.count, 'items')
          //     model.bulkCreate(data).then(res => callback()).catch(callback)
          //   }
          // }))
          .on('finish', callback)
          .on('error', callback)
      }
    }
  })
}

MartaGTFS.prototype.init = function (callback) {
  const gtfs = this
  const zipPath = this.opts.path
  // make sure output directory exists
  const promise = Sequelize.Promise.promisify(mkdirp)(path.dirname(zipPath))
    .then(() => zipFileLastModified(zipPath))
    .then(lastModified => {
      if (lastModified == null || (new Date().getTime() - lastModified) > gtfs.opts.minAge || gtfs.opts.force) {
        return new Promise((resolve, reject) => {
          console.log('Downloading latest GTFS data')
          request(GTFS_URL)
            .on('error', reject)
            .pipe(fs.createWriteStream(zipPath))
            .on('finish', resolve)
        }).then(() => {
          // re-create tables on the database
          console.log('recreating tables')
          return gtfs.sequelize.sync({ force: true })
        }).then(() => gtfs.sequelize.query('PRAGMA foreign_keys = OFF')) // disable foreign keys so we can insert in arbitrary order
        .then(() => {
          // read the zip file
          console.log('reading data')
          return new Promise((resolve, reject) => {
            fs.createReadStream(zipPath)
              .pipe(unzipper.Parse())
              // stream each file into its table
              .pipe(createTableStream(gtfs))
              .on('error', reject)
              .on('finish', resolve)
          })
        })
      } else {
        return Promise.resolve(gtfs) // already up-to-date
      }
    })

  if (callback && typeof callback === 'function') {
    promise.then(callback)
  }
  return promise
}

module.exports = MartaGTFS
