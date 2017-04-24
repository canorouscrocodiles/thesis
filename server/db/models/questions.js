const db = require('../index')

// const selectQuestions = (coordinates) => db.manyOrNone(`SELECT *, ST_AsGeoJSON(coordinates) from questions WHERE ST_DWITHIN(coordinates, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, 402) ORDER BY created_timestamp DESC`)

const selectQuestions = (coordinates) => db.manyOrNone(`
  WITH questions AS (
    SELECT q.id, q.user_id, q.created_timestamp AS timestamp, q.message, q.coordinates, q.location, q.vote_count, q.view_count, q.active, q.category_id, u.username, u.img_url AS avatar, c.name AS category
    FROM questions AS q
    INNER JOIN users AS u ON q.user_id = u.id
    INNER JOIN categories AS c ON q.category_id = c.id
    WHERE q.active = 't'
  )
  SELECT *, ST_AsGeoJSON(coordinates)
  FROM questions
  WHERE ST_DWITHIN(coordinates, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, 402)
  ORDER BY timestamp DESC
`)

const selectUserQuestions = (id) => db.manyOrNone(`
  SELECT q.id, q.user_id, q.created_timestamp AS timestamp, q.message, q.coordinates, q.location, q.vote_count, q.view_count, q.active, u.username, c.name AS category
  FROM questions AS q
  INNER JOIN users AS u ON q.user_id = u.id
  INNER JOIN categories AS c ON q.category_id = c.id
  WHERE q.user_id = ${id}
`)

const selectOneQuestion = (id) => db.oneOrNone(`
  SELECT q.id, q.user_id, q.created_timestamp AS timestamp, q.message, q.coordinates, q.location, q.vote_count, q.view_count, q.category_id, u.username, u.img_url AS avatar, c.name AS category, ST_AsGeoJSON(coordinates)
  FROM questions AS q
  INNER JOIN users AS u ON q.user_id = u.id
  INNER JOIN categories AS c ON q.category_id = c.id
  WHERE q.active = 't' AND q.id = ${id}
`)

const selectQuestion = (id) => db.oneOrNone(`SELECT *, ST_AsGeoJSON(coordinates) from questions where id = ${id}`)

const insertQuestion = ({ user_id, message, coordinates, location, category_id }) => db.oneOrNone(`
  INSERT INTO questions (user_id, message, coordinates, location, category_id)
  VALUES (${user_id}, $$${message}$$, ST_SetSRID(ST_MakePoint(${coordinates.lng}, ${coordinates.lat}), 4326)::geography, $$${location}$$, ${category_id})
  RETURNING id
`)

const updateLastViewedTime = (id) => db.none(`UPDATE questions SET last_viewed_timestamp = now() WHERE id = ${id}`)

const updateLastUpdatedTime = (id) => db.none(`UPDATE questions SET updated_timestamp = now() WHERE id = ${id}`)

const updateQuestion = ({ id, message, category_id }) => db.none(`UPDATE questions SET message = $$${message}$$, category_id = ${category_id} WHERE id = ${id}`)

const deleteQuestion = (id) => db.none(`DELETE FROM questions WHERE id = ${id}`)

const deactivateQuestion = (id) => db.none(`UPDATE questions SET active = 'f' WHERE id = ${id}`)

const deactivateQuestions = () => db.none(`UPDATE questions SET active = 'f' WHERE updated_timestamp <= NOW() - INTERVAL '48 hour'`)

const getCategories = () => db.manyOrNone(`SELECT * FROM categories`)

module.exports = {
  selectQuestions: selectQuestions,
  selectQuestion: selectQuestion,
  selectOneQuestion: selectOneQuestion,
  selectUserQuestions: selectUserQuestions,
  insertQuestion: insertQuestion,
  updateLastViewedTime: updateLastViewedTime,
  updateLastUpdatedTime: updateLastUpdatedTime,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion,
  deactivateQuestion: deactivateQuestion,
  deactivateQuestions: deactivateQuestions,
  getCategories: getCategories
}
