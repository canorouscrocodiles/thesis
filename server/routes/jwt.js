const jwt = require('jsonwebtoken')
const userDB = require('../db/models/users')

const serialize = function serialize (req, res, next) {
  let profile = req.user
  userDB.insertUser({
    id: profile._json.id,
    username: profile._json.first_name,
    email: 'email@test.com',
    img_url: 'www.test.com',
    bio: 'My bio'
  })
  .then((data) => {
    next()
  })
  .catch(error => console.log(error))
}

const generateToken = function generateToken (req, res, next) {
  let profile = req.user
  jwt.sign({ id: profile._json.id, username: profile._json.first_name }, process.env.JWT_SECRET, { issuer: 'OnPoint', expiresIn: '2 days' }, function (error, token) {
    if (error) {
      console.log(`JWT signing error: ${error}`)
    } else {
      console.log(`JWT token: ${token}`)
      req.token = token
      next()
    }
  })
}

const respond = function respond (req, res) {
  res.cookie('onpoint-bearer', req.token)
  res.redirect('/')
}

module.exports = {
  serialize,
  generateToken,
  respond
}
