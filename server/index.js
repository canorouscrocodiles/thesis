const express = require('express')
const port = process.env.PORT || 8080
const { fbClientId, fbClientSecret, fbCallbackUrl } = require('../facebookSecret')
const path = require('path')
const bodyParser = require('body-parser')
const router = require('./router')
const authRouter = require('./authRouter')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
module.exports.app = app
module.exports.server = server
module.exports.io = io
const socket = require('./sockets')

if (!module.parent) {
  server.listen(port, () => console.log(`Listening on port: ${port}`))
}

let fbOptions = {
  clientID: process.env.CLIENTID || fbClientId,
  clientSecret: process.env.CLIENTSECRET || fbClientSecret,
  callbackURL: process.env.HOSTNAME ? `${process.env.HOSTNAME}/auth/facebook/callback` : fbCallbackUrl,
  profileFields: ['id', 'email', 'locale', 'name', 'updated_time', 'verified']
}

// TODO: Grab email and profile pic from FB
passport.use(
  new FacebookStrategy(fbOptions, function (accessToken, refreshToken, profile, done) {
    done(null, profile)
  })
)

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public/')))
app.use(passport.initialize())
app.use('/api', router)
app.use('/auth', authRouter)
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))

io.on('connection', socket)
