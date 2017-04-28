const Votes = require('../db/models/votes')
const io = require('../index').io
const UPDATE_VOTE_SUCCESS = 'UPDATE_VOTE_SUCCESS'
const UPDATE_VOTE_FAILURE = 'UPDATE_VOTE_FAILURE'

module.exports = (socket, action) => {
  let userRemovedVote
  let voteStored
  return Votes.selectVote(action)
  .then((vote) => {
    if (vote) {
      voteStored = vote.vote_type
      if (vote.vote_type === action.vote_type) {
        userRemovedVote = true
        return Votes.updateVote({ user_id: action.user_id, vote_type: 0, answer_id: action.answer_id, question_id: action.question_id })
      } else {
        return Votes.updateVote(action)
      }
    } else {
      return Votes.insertVote(action)
    }
  })
  .then(() => {
    let updatedVoteType
    if (userRemovedVote) {
      updatedVoteType = action.vote_type === 1 ? -1 : 1
      return Votes.updateAnswerVotes({ vote_type: updatedVoteType, answer_id: action.answer_id })
    } else if (voteStored - 2 === -1 || voteStored + 2 === 1) {
      updatedVoteType = voteStored - 2 === -1 ? -2 : 2
      return Votes.updateAnswerVotes({ vote_type: updatedVoteType, answer_id: action.answer_id })
    } else {
      return Votes.updateAnswerVotes(action)
    }
  })
  .then((updatedVote) => {
    io.to(action.question_id).emit('action', { type: UPDATE_VOTE_SUCCESS, data: { question_id: action.question_id, answer_id: action.answer_id, vote_count: updatedVote.vote_count } })
    console.log(`User ${socket.id} updated his vote to answer ${action.data.answer_id} with the vote type of ${action.data.vote_type}`)
  })
  .catch((error) => {
    console.log(`Error on selecting, updating or inserting a row in votes table. ${error}`)
    io.to(socket.id).emit('action', { type: UPDATE_VOTE_FAILURE, data: error })
  })
}
