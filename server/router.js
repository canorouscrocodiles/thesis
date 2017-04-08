const router = require('express').Router()

router.get('/questions', (req, res) => res.sendStatus(200))
router.post('/questions', (req, res) => res.sendStatus(201))

router.post('/answers', (req, res) => res.sendStatus(201))

router.get('/users', (req, res) => res.sendStatus(200))
router.post('/users', (req, res) => res.sendStatus(201))
router.put('/users', (req, res) => res.sendStatus(200))
router.delete('/users', (req, res) => res.sendStatus(200))

module.exports = router
