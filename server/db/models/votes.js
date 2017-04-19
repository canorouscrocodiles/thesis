const db = require('../index')

const selectVote = ({ user_id, answer_id, question_id }) => {
  return db.oneOrNone(`SELECT * FROM votes WHERE user_id = ${user_id} AND question_id = ${question_id} AND answer_id = ${answer_id}`)
}

const updateVote = ({ user_id, vote_type, answer_id, question_id }) => {
  return db.none(`UPDATE votes SET vote_type = ${vote_type} WHERE user_id = ${user_id} AND question_id = ${question_id} AND answer_id = ${answer_id}`)
}

const insertVote = ({ user_id, vote_type, answer_id, question_id }) => {
  return db.none(`INSERT INTO votes (user_id, answer_id, question_id, vote_type) VALUES (${user_id}, ${answer_id}, ${question_id}, ${vote_type})`)
}

const updateAnswerVotes = ({ answer_id, vote_type }) => {
  return db.one(`UPDATE answers SET vote_count = vote_count + ${vote_type} WHERE id = ${answer_id} RETURNING vote_count`)
}

module.exports = {
  updateVote: updateVote,
  selectVote: selectVote,
  insertVote: insertVote,
  updateAnswerVotes: updateAnswerVotes
}
