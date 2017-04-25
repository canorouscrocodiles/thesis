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
        questionHandler.findAndJoin(socket, action.data)
        break
      case 'enter/':
        console.log(`User id: ${action.data.user_id} with socket id: ${socket.id} is entering room with id ${action.data.question_id}`)
        if (!socket.rooms[action.data.question_id]) {
          questionHandler.enterRoom(socket, action)
        }
        break
      case 'leave/':
        console.log(`User id: ${action.data.user_id} with socket id: ${socket.id} is leaving room with id ${action.data.question_id}`)
        questionHandler.leaveRoom(socket, action)
        break
      case 'post/ANSWER_TO_QUESTION':
        console.log(`User with socket id: ${socket.id} is posting answer ${action.data}`)

        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => answerHandler.postAnswer(socket, action.data))
          .then(() => questionHandler.updateLastUpdatedTime(action.data.question_id))
          .catch(({name, message}) => {
            console.log(`${name} - ${message}`)
            socket.emit('action', { type: 'AUTHORIZATION ERROR' })
          })

        break
      case 'post/question':
        console.log(`User with socket id: ${socket.id} is posting a question`)

        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => questionHandler.insertQuestion(socket, action.data))
          .catch(({name, message}) => {
            console.log(`${name} - ${message}`)
            socket.emit('action', { type: 'AUTHORIZATION ERROR' })
          })

        break
      case 'get/question':
        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => {
            questionHandler.selectQuestion(socket, action.data)
            console.log(`User with socket id: ${socket.id} is requesting question with id ${action.data}`)
          })
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
        break
      case 'post/location':
        locationHandler.updateLocation(socket, action.data)
        break
      case 'put/vote':
        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => {
            updateVote(socket, action.data)
            console.log(`User ${socket.id} updated his vote to answer ${action.data.answer_id} with the vote type of ${action.data.vote_type}`)
          })
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
        break
      case 'put/question':
        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => {
            questionHandler.updateQuestion(socket, action.data)
            console.log(`User ${socket.id} updated his question`)
          })
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
        break
      case 'put/answer':
        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => {
            answerHandler.updateAnswer(socket, action.data)
            console.log(`User ${socket.id} updated his answer`)
          })
          .then(() => questionHandler.updateLastUpdatedTime(action.data.question_id))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
        break
      case 'get/categories':
        questionHandler.getCategories(socket)
        break
      case 'put/deactivate-question':
        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => questionHandler.deactivateQuestion(socket, action.data))
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
        break
      case 'get/unread':
        verifyJWT(action.token)
          .then(({ id }) => verifyUser(id))
          .then(validateUser)
          .then(() => {
            console.log(`User ${socket.id} getting unread answers`)
            answerHandler.getUnreadAnswers(socket, action.data)
          })
          .catch(() => socket.emit('action', { type: 'AUTHORIZATION ERROR' }))
        break
      default:
        break
    }
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected with id ${socket.id}`)
    locationHandler.deleteLocation(socket.id)
  })
}
