// const questionHandler = require('../sockets/questions')
const answerHandler = require('./sockets/answers')
const socketTestActions = require('../client/actions/sockets/testPing')
// const socketActions = require('../client/actions/sockets')
const allClients = {}

module.exports = socket => {
  console.log('A client connected')
  socket.user = 'anonymous'
  socket.join(socket.user)

  // socket.on('disconnect', cb) = remove client from list
  // socket.on('updated location', cb) = emit new questions in client's area
  // socket.on('question created', cb) = emit new question from client to other users in area
  // socket.on('answer created', cb) = emit answer to OP and to clients inside the area

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
        answerHandler.postAnswer(socket, action.data)
        break
      default:
        break
        // socket.emit('action', { type: socketActions.SERVER_TO_CLIENT_FAILURE, error: 'No socket route match'})
    }
  })

  socket.on('disconnect', () => console.log(`client disconnected with id ${socket.id}`))
}
