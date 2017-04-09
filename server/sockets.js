const rooms = []
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
}
