const db = require('../index')

const selectQuestions = () => db.manyOrNone('SELECT * from questions')

const selectQuestion = (id) => db.oneOrNone('SELECT * from questions where id = $1', [id])

const insertQuestion = ({ user_id, message, coordinates, location }) => db.none('INSERT INTO questions (user_id, message, coordinates, location) VALUES ($1, $2, $3, $4)', [user_id, message, coordinates, location])

const updateQuestion = ({ user_id, message, coordinates, location }) => db.none('UPDATE questions SET message = $1, coordinates = $2, location = $3 WHERE user_id = $4', [message, coordinates, location, user_id])

const deleteQuestion = (id) => db.none('DELETE FROM questions WHERE id = $1', [id])

module.exports = {
  selectQuestions: selectQuestions,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}
