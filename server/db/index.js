const promise = require('bluebird')
const options = { promiseLib: promise }

const pgp = require('pg-promise')(options)

let dbUrl

if (process.env.NODE_ENV === 'development') {
  dbUrl = `postgres://Sent:@localhost:5432/thesis_${process.env.NODE_ENV}`
} else if (process.env.NODE_ENV === 'test') {
  dbUrl = `postgres://Sent:@localhost:5432/thesis_${process.env.NODE_ENV}`
} else {
  dbUrl = process.env.DATABASE_URL
}

module.exports = pgp(dbUrl)
