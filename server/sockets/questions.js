const Questions = require('../db/models/questions')
const io = require('../index').io
const POST_QUESTION_SUCCESS = 'POST_QUESTION_SUCCESS'
const POST_QUESTION_FAILURE = 'POST_QUESTION_FAILURE'
const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS'
const UPDATE_QUESTION_FAILURE = 'UPDATE_QUESTION_FAILURE'
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
      socket.emit('action', { type: POST_QUESTION_FAILURE, error: `Failed to insert question and query all questions. Error: ${error}` })
    })
}

const updateQuestion = (socket, action) => {
  Questions.updateQuestion(action)
  .then(() => {
    io.to(action.id).emit('action', { type: UPDATE_QUESTION_SUCCESS, data: action })
  })
  .catch((error) => {
    console.log(`Failed to update question. ${error}`)
    socket.emit('action', { type: UPDATE_QUESTION_FAILURE, error: `Failed to update question ${error}` })
  })
}

module.exports = {
  enterRoom: enterRoom,
  leaveRoom: leaveRoom,
  updateLastUpdatedTime: updateLastUpdatedTime,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion
}
