const db = require('../index')

const selectQuestions = () => db.manyOrNone('SELECT * from questions ORDER BY created_timestamp DESC')

const selectQuestion = (id) => db.oneOrNone('SELECT * from questions where id = $1', [id])

const insertQuestion = ({ user_id, message, coordinates, location, category_id }) => db.none('INSERT INTO questions (user_id, message, coordinates, location, category_id) VALUES ($1, $2, $3, $4, $5)', [user_id, message, coordinates, location, category_id])

const updateQuestion = ({ id, message, coordinates, location, category_id }) => db.none('UPDATE questions SET message = $1, coordinates = $2, location = $3, category_id = $4 WHERE id = $5', [message, coordinates, location, category_id, id])

const deleteQuestion = (id) => db.none('DELETE FROM questions WHERE id = $1', [id])

module.exports = {
  selectQuestions: selectQuestions,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}
