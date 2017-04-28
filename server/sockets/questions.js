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
const NEW_QUESTION_POSTED = 'NEW_QUESTION_POSTED'

const enterRoom = (socket, action) => {
  socket.join(action.data.question_id)
  if (action.data.question_creator) {
    console.log(`Updating last viewed timestamp of question with id ${action.data.question_id}`)
    return Questions.updateLastViewedTime(action.data.question_id)
  }
  console.log(`User id: ${action.data.user_id} with socket id: ${socket.id} is entering room with id ${action.data.question_id}`)
}

const leaveRoom = (socket, action) => {
  if (action.data.question_creator) {
    console.log(`Updating last viewed timestamp of question with id ${action.data.question_id}`)
    return Questions.updateLastViewedTime(action.data.question_id)
  } else {
    socket.leave(action.data.question_id)
    console.log(`User id: ${action.data.user_id} with socket id: ${socket.id} is leaving room with id ${action.data.question_id}`)
  }
}

const updateLastUpdatedTime = (id) => {
  console.log(`Updating last viewed timestamp of question with id ${id}`)
  return Questions.updateLastUpdatedTime(id)
}

const selectQuestion = (socket, action) => {
  return Questions.selectQuestion(action)
    .then(question => {
      if (Object.keys(question).length > 0) {
        io.to(socket.id).emit('action', { type: GET_QUESTION_SUCCESS, data: question })
        console.log(`User with socket id: ${socket.id} is requesting question with id ${action.data}`)
      } else {
        io.to(socket.id).emit('action', { type: GET_QUESTION_FAILURE, error: 'No question found' })
      }
    })
    .catch((err) => console.log(err))
}

const insertQuestion = (socket, action) => {
  let targetQuestion = null

  return Questions.insertQuestion(action)
    .then(({id}) => Questions.selectOneQuestion(id))
    .then(question => {
      targetQuestion = question
      // Run query to find all users within 0.25mi of action.coordinates
      return Sockets.findSockets(action.coordinates)
    })
    .then(users => {
      console.log(`Users found ${JSON.stringify(users)}`)

      // Iterate over users emiting to each of them the targetQuestion
      if (users.length > 0) {
        let userIds = users.map(user => user.id)
        userIds.forEach(id => {
          io.to(id).emit('action', { type: POST_QUESTION_SUCCESS, data: targetQuestion })
          // Emit second action to tell everyone that questions have been updated
          io.to(id).emit('action', { type: NEW_QUESTION_POSTED })
        })
      }
    })
    .catch((error) => {
      console.log(`Failed to insert question and query all questions. Error: ${error}`)
      socket.emit('action', { type: POST_QUESTION_FAILURE, error: `Failed to insert question and query all questions. Error: ${error}` })
    })
}

const updateQuestion = (socket, action) => {
  return Questions.updateQuestion(action)
  .then(() => {
    io.to(action.id).emit('action', { type: UPDATE_QUESTION_SUCCESS, data: action })
    console.log(`User ${socket.id} updated his question`)
  })
  .catch((error) => {
    console.log(`Failed to update question. ${error}`)
    socket.emit('action', { type: UPDATE_QUESTION_FAILURE, error: `Failed to update question ${error}` })
  })
}

const getCategories = (socket) => {
  return Questions.getCategories()
  .then((action) => {
    io.to(socket.id).emit('action', { type: GET_CATEGORIES_SUCCESS, data: action })
  })
  .catch((error) => {
    console.log(`Failed to get categories. ${error}`)
    socket.emit('action', { type: GET_CATEGORIES_FAILURE, error: `Failed to get categories. ${error}` })
  })
}

const deactivateQuestion = (socket, question_id) => {
  return Questions.deactivateQuestion(question_id)
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

const findAndJoin = (socket, id) => {
  return Questions.findUserQuestions(id)
  .then((ids) => {
    ids.forEach(id => {
      socket.join(id.id)
    })
  })
}

module.exports = {
  enterRoom: enterRoom,
  leaveRoom: leaveRoom,
  updateLastUpdatedTime: updateLastUpdatedTime,
  selectQuestion: selectQuestion,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion,
  getCategories: getCategories,
  deactivateQuestion: deactivateQuestion,
  findAndJoin: findAndJoin
}
