const db = require('./index')

module.exports = () => db.none(`TRUNCATE sockets RESTART IDENTITY CASCADE`)
