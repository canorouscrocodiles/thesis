const Questions = require('../db/models/questions')
const Sockets = require('../db/models/sockets')
const io = require('../index').io
const POST_QUESTION_SUCCESS = 'POST_QUESTION_SUCCESS'
const POST_QUESTION_FAILURE = 'POST_QUESTION_FAILURE'
const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS'
const UPDATE_QUESTION_FAILURE = 'UPDATE_QUESTION_FAILURE'
const GET_QUESTION_SUCCESS = 'GET_QUESTION_SUCCESS'
const GET_QUESTION_FAILURE = 'GET_QUESTION_FAILURE'
const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS'
const GET_CATEGORIES_FAILURE = 'GET_CATEGORIES_FAILURE'
const QUESTION_DEACTIVATION_FAILURE = 'QUESTION_DEACTIVATION_FAILURE'
const SELECTED_QUESTION_DEACTIVATION_SUCCESS = 'SELECTED_QUESTION_DEACTIVATION_SUCCESS'
const QUESTION_DEACTIVATION_SUCCESS = 'QUESTION_DEACTIVATION_SUCCESS'

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

const getCategories = (socket) => {
  Questions.getCategories()
  .then((action) => {
    socket.emit('action', { type: GET_CATEGORIES_SUCCESS, data: action })
  })
  .catch((error) => {
    console.log(`Failed to get categories. ${error}`)
    socket.emit('action', { type: GET_CATEGORIES_FAILURE, error: `Failed to get categories. ${error}` })
  })
}

const deactivateQuestion = (socket, question_id) => {
  Questions.deactivateQuestion(question_id)
  .then(() => {
    // Emit to all users viewing the question of deactivate question
    io.to(question_id).emit('action', { type: SELECTED_QUESTION_DEACTIVATION_SUCCESS, data: question_id })
    return Sockets.selectCoordinates(socket.id)
  })
  .then(results => {
    const coordinates = parseGeoJSON(results.coordinates)
    return Sockets.findSockets(coordinates)
  })
  .then(sockets => {
    // Emit to all users within radius of deactivated question
    sockets.forEach(s => {
      io.to(s.id).emit('action', { type: QUESTION_DEACTIVATION_SUCCESS, data: question_id })
    })
  })
  .catch(error => {
    console.log(`Failed to deactivate question ${error}`)
    socket.emit('action', { type: QUESTION_DEACTIVATION_FAILURE, error: `Failed to deactivate question ${error}` })
  })
}

var parseGeoJSON = function (location) {
  let geojson = JSON.parse(location)
  let coordinates = {
    lng: geojson.coordinates[0],
    lat: geojson.coordinates[1]
  }
  return coordinates
}

module.exports = {
  enterRoom: enterRoom,
  leaveRoom: leaveRoom,
  updateLastUpdatedTime: updateLastUpdatedTime,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion,
  getCategories: getCategories,
  deactivateQuestion: deactivateQuestion
}
