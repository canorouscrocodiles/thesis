const db = require('../index')

const findSockets = (coordinates) => db.manyOrNone(`SELECT * FROM sockets WHERE ST_DWITHIN(coordinates, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, 402)`)

const insertSocket = ({ id, coordinates }) => db.none(`INSERT INTO sockets (id, coordinates) VALUES ('${id}', ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography)`)

const deleteSocket = (id) => db.none(`DELETE FROM sockets WHERE id = '${id}'`)

const updateSocket = ({ id, coordinates }) => db.none(`UPDATE sockets SET coordinates = ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography WHERE id = '${id}'`)

const selectCoordinates = (id) => db.one(`SELECT ST_AsGeoJSON(coordinates) as coordinates from sockets WHERE id = '${id}'`)

module.exports = {
  findSockets: findSockets,
  insertSocket: insertSocket,
  updateSocket: updateSocket,
  deleteSocket: deleteSocket,
  selectCoordinates: selectCoordinates
}
