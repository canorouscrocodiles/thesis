const db = require('../db/models/votes')

const updateVote = (req, res) => {
  // const { id, vote_type, answer_id } = req.body
  // db.updateVote({ id, vote_type, answer_id })
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

module.exports = {
  updateVote: updateVote
}
