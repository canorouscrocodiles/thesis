const jwt = require('jsonwebtoken')
const userDB = require('../db/models/users')

const serialize = function serialize (req, res, next) {
  let profile = req.user._json
  userDB.insertUser({
    id: profile.id,
    username: profile.first_name,
    email: 'email@test.com',
    img_url: `http://graph.facebook.com/${profile.id}/picture?type=large`,
    bio: 'My bio'
  })
  .then((data) => {
    next()
  })
  .catch(error => console.log(error))
}

const generateToken = function generateToken (req, res, next) {
  let profile = req.user._json
  jwt.sign({ id: profile.id, username: profile.first_name }, process.env.JWT_SECRET, { issuer: 'OnPoint', expiresIn: '90 days' }, function (error, token) {
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
  let profile = req.user._json
  res.cookie('onpoint-bearer', req.token)
  res.cookie('onpoint-username', profile.first_name)
  res.cookie('onpoint-id', profile.id)
  res.redirect('/')
}

module.exports = {
  serialize,
  generateToken,
  respond
}
