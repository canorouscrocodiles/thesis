const promise = require('bluebird')
const { dbHost } = require('../../project.config.js')
const options = { promiseLib: promise }

const pgp = require('pg-promise')(options)
module.exports = pgp(dbHost)
