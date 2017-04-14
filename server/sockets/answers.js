const Answers = require('../db/models/answers')

//  ------------- NOT TESTED -------------------
export const postAnswer = (socket, action) => {
  const { message, user_id, question_id } = action.data
  Answers.insertAnswer({message, user_id, question_id})
    .then(() => {
      socket.emit({
        type: 'SERVER_TO_CLIENT'
      })
    })
    .catch(error => {
      console.log(`Error: ${error}`)
      socket.emit({
        type: 'SERVER_TO_CLIENT',
        error: 'Failed to insert answer into DB'
      })
    })
}
