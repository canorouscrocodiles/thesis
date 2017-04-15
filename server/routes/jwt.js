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
    console.log('Returning data: ', data)
    next()
  })
  .catch(error => console.log(error))
}

const generateToken = function generateToken (req, res, next) {
  jwt.sign({ id: 123 }, 'secret', { issuer: 'OnPoint', expiresIn: '2 days' }, function (error, token) {
    if (error) {
      console.log('JWT signing error: ', error)
    } else {
      console.log('JWT token: ', token)
      req.token = token
      next()
    }
  })
}

const respond = function respond (req, res) {
  console.log('Time to respond')
  res.redirect(`/#token=${req.token}`)
}

module.exports = {
  serialize,
  generateToken,
  respond
}
