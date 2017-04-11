const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const router = require('./router')
const socket = require('./sockets')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080

if (!module.parent) {
  server.listen(port, () => console.log(`Listening on port: ${port}`))
}

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public/')))
app.use('/api', router)
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))

io.on('connection', socket)

module.exports.app = app
module.exports.server = server
module.exports.io = io
