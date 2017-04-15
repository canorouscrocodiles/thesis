const router = require('express').Router()
const passport = require('passport')
const { serialize, generateToken, respond } = require('./routes/jwt')

// TODO: LOGGING OUT
router.post('/logout', (req, res) => {
  // Save JWT in table of expired JWTs for validation later
  res.redirect('/')
})

// PASSPORT FACEBOOK AUTHENTICATION
router.get('/facebook', passport.authenticate('facebook', { session: false }))
router.get('/facebook/callback', passport.authenticate('facebook', { scope: ['email'], session: false, failureRedirect: '/' }), serialize, generateToken, respond)

module.exports = router
