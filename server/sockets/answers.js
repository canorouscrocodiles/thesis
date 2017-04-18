const io = require('../index').io
const Answers = require('../db/models/answers')

//  ------------- NOT TESTED -------------------
module.exports.postAnswer = (socket, action) => {
  const { message, user_id, question_id } = action
  Answers.insertAnswer({message, user_id, question_id})
    .then(({id}) => Answers.selectIndividualAnswer(id))
    .then((answer) => {
      io.to(question_id).emit('action', {
        type: 'SUCCESSFUL_POST_ANSWER',
        data: answer
      })
    })
    .catch(error => {
      console.log(`Error: ${error}`)
      socket.emit({
        type: 'FAILED_POST_ANSWER',
        error: 'Failed to insert answer into DB'
      })
    })
}
