const jwt = require('jsonwebtoken')
const { verifyUser } = require('./db/models/users')
const questionHandler = require('./sockets/questions')
const answerHandler = require('./sockets/answers')
const locationHandler = require('./sockets/location')
const updateVote = require('./sockets/votes')

const verifyJWT = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

const validateUser = data => {
  return new Promise((resolve, reject) => {
    let exists = data[0].exists
    if (!exists) {
      reject(new Error(`Authentication Error: User doesn't exist in DB`))
    } else {
      resolve()
    }
  })
}

module.exports = socket => {
  console.log(`Client connected with id: ${socket.id}`)
  socket.on('action', action => {
    switch (action.type) {
      case 'get/findAndJoin':
        return questionHandler.findAndJoin(socket, action.data)
      case 'enter/':
        return questionHandler.enterRoom(socket, action)
        // if (!socket.rooms[action.data.question_id]) {
        //   return questionHandler.enterRoom(socket, action)
        // }
      case 'leave/':
        return questionHandler.leaveRoom(socket, action)
      case 'post/ANSWER_TO_QUESTION':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => answerHandler.postAnswer(socket, action.data))
          .then(() => questionHandler.updateLastUpdatedTime(action.data.question_id))
          .catch(({name, message}) => {
            console.log(`${name} - ${message}`)
            socket.emit('action', { type: 'AUTHORIZATION ERROR' })
          })
        // console.log(`User with socket id: ${socket.id} is posting answer ${action.data}`)
      case 'post/question':
        console.log(`User with socket id: ${socket.id} is posting a question`)
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => questionHandler.insertQuestion(socket, action.data))
          .catch(({name, message}) => {
            console.log(`${name} - ${message}`)
            socket.emit('action', { type: 'AUTHORIZATION ERROR' })
          })
      case 'get/question':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => questionHandler.selectQuestion(socket, action.data))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
      case 'post/location':
        return locationHandler.updateLocation(socket, action.data)
      case 'put/vote':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => updateVote(socket, action.data))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
      case 'put/question':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => questionHandler.updateQuestion(socket, action.data))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
      case 'put/answer':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => answerHandler.updateAnswer(socket, action.data))
          .then(() => questionHandler.updateLastUpdatedTime(action.data.question_id))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
      case 'get/categories':
        return questionHandler.getCategories(socket)
      case 'put/deactivate-question':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => questionHandler.deactivateQuestion(socket, action.data))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
      case 'get/unread':
        return verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => answerHandler.getUnreadAnswers(socket, action.data))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
      default:
        break
    }
  })

  socket.on('disconnect', () => {
    return locationHandler.deleteLocation(socket.id)
  })
}
