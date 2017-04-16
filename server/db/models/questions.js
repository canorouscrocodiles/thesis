const db = require('../index')

const selectQuestions = (coordinates) => db.manyOrNone(`SELECT *, ST_AsGeoJSON(coordinates) from questions WHERE ST_DWITHIN(coordinates, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, 402) ORDER BY created_timestamp DESC`)

const selectQuestion = (id) => db.oneOrNone('SELECT *, ST_AsGeoJSON(coordinates) from questions where id = $1', [id])

const insertQuestion = ({ user_id, message, coordinates, location, category_id }) => db.none(`INSERT INTO questions (user_id, message, coordinates, location, category_id) VALUES (${user_id}, '${message}', ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, '${location}', ${category_id})`)

const updateQuestion = ({ id, message, category_id }) => db.none('UPDATE questions SET message = $1, category_id = $2 WHERE id = $3', [message, category_id, id])

const deleteQuestion = (id) => db.none('DELETE FROM questions WHERE id = $1', [id])

module.exports = {
  selectQuestions: selectQuestions,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}
