const db = require('../index')

const selectAnswers = (id) => db.manyOrNone(`SELECT * FROM answers WHERE user_id = ${id}`)

const selectIndividualAnswer = (id) => db.oneOrNone(`
  SELECT a.id, a.question_id, a.created_timestamp AS timestamp, a.message, a.vote_count, u.username, u.id AS user_id, u.img_url AS avatar, q.message AS question_message
  FROM answers AS a
  INNER JOIN users AS u ON a.user_id = u.id
  INNER JOIN questions AS q ON a.question_id = q.id
  WHERE a.id = ${id}
`)

const selectUserAnswers = (id) => db.manyOrNone(`
  SELECT a.id, a.question_id, a.created_timestamp AS timestamp, a.message, a.vote_count, u.username, u.id AS user_id, u.img_url AS avatar, q.message as question_message
  FROM answers AS a
  INNER JOIN users AS u ON a.user_id = u.id
  INNER JOIN questions AS q ON a.question_id = q.id
  WHERE u.id = ${id}
`)

const selectQuestionAnswers = (id) => db.manyOrNone(`
  SELECT a.id, a.question_id, a.created_timestamp AS timestamp, a.message, a.vote_count, u.username, u.id AS user_id, u.img_url AS avatar
  FROM answers AS a
  INNER JOIN users AS u ON a.user_id = u.id
  WHERE question_id = ${id}
`)

const insertAnswer = ({ message, user_id, question_id }) => db.oneOrNone(`
  INSERT INTO answers (message, user_id, question_id)
  VALUES ($$${message}$$, ${user_id}, ${question_id})
  RETURNING id
  `)

const deleteAnswer = (id) => db.none(`DELETE FROM answers WHERE id = ${id}`)

const updateAnswer = ({ message, id }) => db.none(`UPDATE answers SET message = $$${message}$$ WHERE id = ${id}`)

module.exports = {
  selectAnswers: selectAnswers,
  selectIndividualAnswer: selectIndividualAnswer,
  selectQuestionAnswers: selectQuestionAnswers,
  selectUserAnswers: selectUserAnswers,
  insertAnswer: insertAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
