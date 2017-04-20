const Votes = require('../db/models/votes')
const ErrorResponseHandler = require('./error')

const updateVote = (req, res) => {
  const { user_id, vote_type, answer_id } = req.body
  Votes.updateVote({ user_id, vote_type, answer_id })
  .then(() => res.sendStatus(200))
  .catch(err => ErrorResponseHandler(err, res, 500))
}

module.exports = {
  updateVote: updateVote
}
