const promise = require('bluebird')
const project = require('../../project.config.js')
const options = {
  promiseLib: promise
}
const pgp = require('pg-promise')(options)
const db = pgp(project)

console.log(`DB Host: ${project.db.host}`)

module.exports = db
