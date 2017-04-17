const promise = require('bluebird')
const options = { promiseLib: promise }

const pgp = require('pg-promise')(options)

let dbUrl

if (process.env.NODE_ENV === 'development') {
  dbUrl = process.env.DEV_DB_URL
} else if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.TEST_DB_URL
} else {
  dbUrl = process.env.DATABASE_URL
}

module.exports = pgp(dbUrl)
