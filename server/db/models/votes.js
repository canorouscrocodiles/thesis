const db = require('../index')

const updateVote = ({id, vote_type, answer_id }) => db.none('UPDATE votes SET vote_type = $1 WHERE id = $2 AND answer_id = $3', [vote_type, id, answer_id])

module.exports = {
  updateVote: updateVote
}
