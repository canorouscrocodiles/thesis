const db = require('../index')

const updateVote = ({ user_id, vote_type, answer_id }) => {
  return db.one('SELECT * FROM votes WHERE user_id = $1 AND answer_id = $2', [user_id, answer_id])
  .then((user) => db.none('UPDATE votes SET vote_type = $1 WHERE user_id = $2 AND answer_id = $3', [vote_type, user_id, answer_id]))
  .catch(() => db.none('INSERT INTO votes (user_id, answer_id, vote_type) VALUES ($1, $2, $3)', [user_id, answer_id, vote_type]))
}

module.exports = {
  updateVote: updateVote
}
