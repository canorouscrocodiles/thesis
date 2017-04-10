const promise = require('bluebird')
const project = require('../../project.config.js')
const options = {
  promiseLib: promise
}
const pgp = require('pg-promise')(options)
const db = pgp(project)

module.exports = db
