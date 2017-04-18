const db = require('../index')

// const selectQuestions = (coordinates) => db.manyOrNone(`SELECT *, ST_AsGeoJSON(coordinates) from questions WHERE ST_DWITHIN(coordinates, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, 402) ORDER BY created_timestamp DESC`)

const selectQuestions = (coordinates) => db.manyOrNone(`
  WITH questions AS (
    SELECT q.id, q.user_id, q.created_timestamp AS timestamp, q.message, q.coordinates, q.location, q.vote_count, q.view_count, u.username, u.img_url AS avatar, c.name AS category
    FROM questions AS q
    INNER JOIN users AS u ON q.user_id = u.id
    INNER JOIN categories AS c ON q.category_id = c.id
  )
  SELECT *, ST_AsGeoJSON(coordinates)
  FROM questions
  WHERE ST_DWITHIN(coordinates, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, 402)
  ORDER BY timestamp DESC
`)

const selectQuestion = (id) => db.oneOrNone(`SELECT *, ST_AsGeoJSON(coordinates) from questions where id = ${id}`)

const insertQuestion = ({ user_id, message, coordinates, location, category_id }) => db.none(`INSERT INTO questions (user_id, message, coordinates, location, category_id) VALUES (${user_id}, $$${message}$$, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, $$${location}$$, ${category_id})`)

const updateQuestion = ({ id, message, category_id }) => db.none(`UPDATE questions SET message = $$${message}$$, category_id = ${category_id} WHERE id = ${id}`)

const deleteQuestion = (id) => db.none(`DELETE FROM questions WHERE id = ${id}`)

module.exports = {
  selectQuestions: selectQuestions,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}
