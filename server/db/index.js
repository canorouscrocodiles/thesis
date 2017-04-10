const promise = require('bluebird')
const project = require('../../project.config.js')
const options = {
  promiseLib: promise
}
const pgp = require('pg-promise')(options)
const db = pgp(project.db)

console.log(`DB Host: ${project.db.host}`)
console.log(`DB Port: ${project.db.port}`)
console.log(`DB User: ${project.db.user}`)
console.log(`DB Name: ${project.db.database}`)

module.exports = db
