require('dotenv').config()
const express = require('express')
const port = process.env.PORT
const path = require('path')
const bodyParser = require('body-parser')
const router = require('./router')
const authRouter = require('./authRouter')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const truncateSocketTable = require('./db/scripts')
const cron = require('node-cron')
const db = require('./db/models/questions')

truncateSocketTable()
.then(() => console.log('Sockets table is truncated'))
.catch((error) => console.log(`Failed to truncate sockets table with error ${error}`))

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
module.exports.app = app
module.exports.server = server
module.exports.io = io
const socket = require('./sockets')

if (!module.parent) {
  server.listen(port, () => {
    console.log(`Listening on port: ${port} in ${process.env.NODE_ENV} environment`)

    cron.schedule('0 0 * * *', () => {
      return db.deactivateQuestions()
      .then(() => console.log('Cron job has deactivated all questions with no new answers within the last 48 hours'))
      .catch((error) => console.log(`Cron job failed to deactivate inactive questions with error ${error}`))
    }, true)
  })
}

let fbOptions = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.HOSTNAME}/auth/facebook/callback`,
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
