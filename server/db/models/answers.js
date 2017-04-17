const db = require('../index')

const selectAnswers = (id) => db.manyOrNone(`SELECT * FROM answers WHERE user_id = ${id}`)

const selectQuestionAnswers = (id) => db.manyOrNone(`SELECT * FROM answers WHERE question_id = ${id}`)

const insertAnswer = ({ message, user_id, question_id }) => db.none(`INSERT INTO answers (message, user_id, question_id) VALUES ($$'${message}'$$, ${user_id}, ${question_id})`)

const deleteAnswer = (id) => db.none(`DELETE FROM answers WHERE id = ${id}`)

const updateAnswer = ({ message, id }) => db.none(`UPDATE answers SET message = $$'${message}'$$ WHERE id = ${id}`)

module.exports = {
  selectAnswers: selectAnswers,
  selectQuestionAnswers: selectQuestionAnswers,
  insertAnswer: insertAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
