const db = require('../index')

const selectAnswers = (id) => db.manyOrNone('SELECT * FROM answers WHERE user_id = $1', [id])

const insertAnswer = ({ message, user_id, question_id }) => db.none('INSERT INTO answers (message, user_id, question_id) VALUES ($1, $2, $3)', [message, user_id, question_id])

const deleteAnswer = (id) => db.none('DELETE FROM answers WHERE id = $1', [id])

const updateAnswer = ({ message, user_id, question_id }) => db.none('UPDATE answers SET message = $1 WHERE user_id = $2 AND question_id = $3', [message, user_id, question_id])

module.exports = {
  selectAnswers: selectAnswers,
  insertAnswer: insertAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
