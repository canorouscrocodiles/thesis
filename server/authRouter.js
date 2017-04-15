const router = require('express').Router()
const passport = require('passport')
const { serialize, generateToken, respond } = require('./routes/jwt')

// PASSPORT FACEBOOK AUTHENTICATION
router.get('/facebook', passport.authenticate('facebook', { session: false }))
router.get('/facebook/callback', passport.authenticate('facebook', { scope: ['email'], session: false, failureRedirect: '/login' }), serialize, generateToken, respond)

module.exports = router
