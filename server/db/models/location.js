const db = require('../index')

const updateLocation = (id, user_id, coordinates) => db.none(`INSERT INTO sockets (id, user_id, coordinates) VALUES ($$${id}$$, ${user_id}, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography) ON CONFLICT (id) DO UPDATE SET coordinates = ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography`)

const deleteLocation = (id) => db.none(`DELETE FROM sockets where id = $$${id}$$`)

module.exports = {
  updateLocation: updateLocation,
  deleteLocation: deleteLocation
}
