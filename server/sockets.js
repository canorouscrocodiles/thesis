const jwt = require('jsonwebtoken')
const { verifyUser } = require('./db/models/users')
const questionHandler = require('./sockets/questions')
const answerHandler = require('./sockets/answers')
const socketTestActions = require('../client/actions/sockets/testPing')
const locationHandler = require('./sockets/location')

const allClients = {}

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

module.exports = socket => {
  console.log(`Client connected with id: ${socket.id}`)
  socket.user = 'anonymous'
  socket.join(socket.user)

  allClients[socket.user] = socket.id
  console.log(`All clients: ${JSON.stringify(allClients)}`)
  socket.emit('echo', 'Hello World')
  socket.emit('clients', allClients)

  socket.on('action', action => {
    switch (action.type) {
      case 'get/helloworld':
        socket.emit('action', { type: socketTestActions.SERVER_TO_CLIENT_TEST_PING, data: 'Client to Server and server to client ping success!' })

        break
      case 'enter/':
        console.log(`User with socket id: ${socket.id} is entering room with id ${action.data}`)
        socket.join(action.data)
        // questionHandler.enterRoom(action, socket)
        break
      case 'leave/':
        console.log(`User with socket id: ${socket.id} is leaving room with id ${action.data}`)
        socket.leave(action.data)

        break
      case 'post/ANSWER_TO_QUESTION':
        console.log(`User with socket id: ${socket.id} is posting answer ${action.data}`)

        verifyJWT(action.data.token)
          .then(({ id }) => verifyUser(id))
          .then(data => {
            let exists = data[0].exists
            if (!exists) {
              throw new Error(`Authentication Error: User doesn't exist in DB`)
            }
          })
          .then(() => answerHandler.postAnswer(socket, action.data))
          .catch(({name, message}) => {
            console.log(`${name} - ${message}`)
            // Emit Authentication error to client
            socket.emit('action', { type: socketTestActions.SERVER_TO_CLIENT_TEST_PING, data: 'Authorization Error' })
          })

        break
      case 'post/question':
        console.log(`User with socket id: ${socket.id} is posting a question`)

        verifyJWT(action.data.token)
          .then(({ id }) => verifyUser(id))
          .then(data => {
            let exists = data[0].exists
            if (!exists) {
              throw new Error(`Authentication Error: User doesn't exist in DB`)
            }
          })
          .then(() => questionHandler.insertQuestion(socket, action.data))
          .catch(({name, message}) => {
            console.log(`${name} - ${message}`)
            // Emit authentication error to client
            socket.emit('action', { type: socketTestActions.SERVER_TO_CLIENT_TEST_PING, data: 'Authorization Error' })
          })

        break
      case 'get/question':
        console.log(`User with socket id: ${socket.id} is requesting question with id ${action.data}`)
        questionHandler.selectQuestion(socket, action.data)
        break
      case 'post/location':
        console.log(`User ${socket.id} updated his location to ${JSON.stringify(action.data)}. Adding it to the sockets table.`);
        locationHandler.updateLocation(socket, action.data)
        break
      default:
        break
        // socket.emit('action', { type: socketActions.SERVER_TO_CLIENT_FAILURE, error: 'No socket route match'})
    }
  })

  socket.on('disconnect', () => {
    console.log(`client disconnected with id ${socket.id}`)
    locationHandler.deleteLocation(socket.id)
  })
}
