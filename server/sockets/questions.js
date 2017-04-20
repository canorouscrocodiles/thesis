const Questions = require('../db/models/questions')
const io = require('../index').io
const POST_QUESTION_SUCCESS = 'POST_QUESTION_SUCCESS'
const POST_QUESTION_FAILURE = 'POST_QUESTION_FAILURE'
const GET_QUESTION_SUCCESS = 'GET_QUESTION_SUCCESS'
const GET_QUESTION_FAILURE = 'GET_QUESTION_FAILURE'

const enterRoom = (socket, action) => {
  socket.join(action.data.question_id)
  if (action.data.question_creator) {
    Questions.updateLastViewedTime(action.data.question_id)
  }
}

const leaveRoom = (socket, action) => {
  if (action.data.question_creator) {
    Questions.updateLastViewedTime(action.data.question_id)
  } else {
    socket.leave(action.data.question_id)
  }
}

const updateLastUpdatedTime = (id) => {
  Questions.updateLastUpdatedTime(id)
}

const selectQuestion = (socket, action) => {
  Questions.selectQuestion(action)
    .then(question => {
      if (Object.keys(question).length > 0) {
        io.to(socket.id).emit('action', { type: GET_QUESTION_SUCCESS, data: question })
      } else {
        io.to(socket.id).emit('action', { type: GET_QUESTION_FAILURE, error: 'No question found' })
      }
    })
    .catch((err) => console.log(err))
}

const insertQuestion = (socket, action) => {
  Questions.insertQuestion(action)
    .then(() => Questions.selectQuestions(action.coordinates))
    .then((questions) => {
      io.emit('action', { type: POST_QUESTION_SUCCESS, data: questions })
      // TODO: emit question to all users within radius not all users as done above
    })
    .catch((error) => {
      console.log(`Failed to insert question and query all questions. Error: ${error}`)
      io.emit('action', { type: POST_QUESTION_FAILURE, error: `Failed to insert question and query all questions. Error: ${error}` })
    })
}

const updateQuestion = (socket, action) => {
  //  verify user
  //  update question in DB
  //  emit update to all users
}

module.exports = {
  enterRoom: enterRoom,
  leaveRoom: leaveRoom,
  updateLastUpdatedTime: updateLastUpdatedTime,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion
}
