const db = require('../index')

const updateVote = ({ user_id, vote_type, answer_id }) => {
  return db.one(`SELECT * FROM votes WHERE user_id = ${user_id} AND answer_id = ${answer_id}`)
  .then((user) => db.none(`UPDATE votes SET vote_type = ${vote_type} WHERE user_id = ${user_id} AND answer_id = ${answer_id}`))
  .catch(() => db.none(`INSERT INTO votes (user_id, answer_id, vote_type) VALUES (${user_id}, ${answer_id}, ${vote_type})`))
}

module.exports = {
  updateVote: updateVote
}
