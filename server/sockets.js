const questionHandler = require('./sockets/questions')
const answerHandler = require('./sockets/answers')
const socketTestActions = require('../client/actions/sockets/testPing')

module.exports = socket => {
  console.log(`Client connected with id: ${socket.id}`)

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
      case 'post/question':
        console.log(`User with socket id: ${socket.id} is posting a question`)
        questionHandler.insertQuestion(socket, action.data)
        break
      case 'get/question':
        console.log(`User with socket id: ${socket.id} is requesting question with id ${action.data}`)
        questionHandler.selectQuestion(socket, action.data)
        break
      default:
        break
        // socket.emit('action', { type: socketActions.SERVER_TO_CLIENT_FAILURE, error: 'No socket route match'})
    }
  })

  socket.on('disconnect', () => console.log(`client disconnected with id ${socket.id}`))
}
