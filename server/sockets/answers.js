const io = require('../index').io
const Answers = require('../db/models/answers')
const utils = require('../serverUtils')

module.exports.postAnswer = (socket, action) => {
  const { message, user_id, question_id } = action
  return Answers.insertAnswer({message, user_id, question_id})
    .then(({id}) => Answers.selectIndividualAnswer(id))
    .then((answer) => {
      io.to(question_id).emit('action', { type: 'SUCCESSFUL_POST_ANSWER', data: answer })
    })
    .catch(error => {
      console.log(`Error: ${error}`)
      socket.emit({
        type: 'FAILED_POST_ANSWER',
        error: 'Failed to insert answer into DB'
      })
    })
}

module.exports.updateAnswer = (socket, action) => {
  return Answers.updateAnswer(action)
  .then(() => {
    io.to(action.question_id).emit('action', { type: 'UPDATE_ANSWER_SUCCESS', data: action })
    console.log(`User ${socket.id} updated his answer`)
  })
  .catch(error => {
    console.log(`Failed to update answer ${error}`)
    socket.emit('action', { type: 'UPDATE_ANSWER_FAILURE', error: `Failed to update answer ${error}` })
  })
}

module.exports.getUnreadAnswers = (socket, user_id) => {
  return Answers.selectUnreadAnswers(user_id)
  .then((data) => {
    let results = utils.transformUnread(data)
    io.to(socket.id).emit('action', { type: 'UNREAD_ANSWERS_SUCCESS', data: results })
    console.log(`User ${socket.id} getting unread answers`)
  })
  .catch(error => {
    console.log(`Failed to get unread answers ${error}`)
    io.to(socket.id).emit('action', { type: 'UNREAD_ANSWERS_FAILURE', error: `Failed to update answer ${error}` })
  })
}
