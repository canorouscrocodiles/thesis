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
  SELECT a.id, a.question_id, a.created_timestamp AS timestamp, a.message, a.vote_count, u.username, u.id AS user_id, u.img_url AS avatar, q.message as question_message, q.active as active_question
  FROM answers AS a
  INNER JOIN users AS u ON a.user_id = u.id
  INNER JOIN questions AS q ON a.question_id = q.id
  WHERE u.id = ${id}
`)

const selectQuestionAnswers = (id, user_id) => {
  if (user_id) {
    return db.manyOrNone(`
      SELECT a.id, a.question_id, a.created_timestamp AS timestamp, a.message, a.vote_count, u.username, u.id AS user_id, u.img_url AS avatar, v.vote_type AS users_vote_count
      FROM answers AS a
      INNER JOIN users AS u ON a.user_id = u.id
      LEFT JOIN votes AS v ON v.user_id = ${user_id} AND v.answer_id = a.id
      WHERE a.question_id = ${id}`)
  }
  return db.manyOrNone(`
  SELECT a.id, a.question_id, a.created_timestamp AS timestamp, a.message, a.vote_count, u.username, u.id AS user_id, u.img_url AS avatar
  FROM answers AS a
  INNER JOIN users AS u ON a.user_id = u.id
  WHERE question_id = ${id}`)
}

const selectUnreadAnswers = (user_id) => db.manyOrNone(`SELECT q.id, q.message AS question_message, a.message AS answer_message FROM questions AS q INNER JOIN answers AS a ON a.question_id = q.id WHERE q.user_id = ${user_id} AND q.updated_timestamp > q.last_viewed_timestamp AND a.updated_timestamp > q.last_viewed_timestamp`)

const insertAnswer = ({ message, user_id, question_id }) => db.oneOrNone(`
  INSERT INTO answers (message, user_id, question_id)
  VALUES ($$${message}$$, ${user_id}, ${question_id})
  RETURNING id
  `)

const deleteAnswer = (id) => db.none(`DELETE FROM answers WHERE id = ${id}`)

const updateAnswer = ({ message, id }) => db.none(`UPDATE answers SET message = $$${message}$$, updated_timestamp = now() WHERE id = ${id}`)

module.exports = {
  selectAnswers: selectAnswers,
  selectIndividualAnswer: selectIndividualAnswer,
  selectQuestionAnswers: selectQuestionAnswers,
  selectUserAnswers: selectUserAnswers,
  selectUnreadAnswers: selectUnreadAnswers,
  insertAnswer: insertAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
