const Votes = require('../db/models/votes')

const updateVote = (req, res) => {
  const { id, vote_type, answer_id } = req.body
  Votes.updateVote({ id, vote_type, answer_id })
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })
}

module.exports = {
  updateVote: updateVote
}
