const router = require('express').Router()
const answerHandlers = require('./routes/answers')
const questionHandlers = require('./routes/questions')
const userHandlers = require('./routes/users')
const voteHandlers = require('./routes/votes')

router.get('/answers/:id', answerHandlers.getAnswers)
router.post('/answers', answerHandlers.postAnswer)
router.put('/answers', answerHandlers.updateAnswer)
router.delete('/answers', answerHandlers.deleteAnswer)

router.put('/votes', voteHandlers.updateVote)

router.get('/questions', questionHandlers.getQuestions)
router.get('/questions/:id', questionHandlers.getQuestion)
router.post('/questions', questionHandlers.createQuestion)
router.put('/questions', questionHandlers.updateQuestion)
router.delete('/questions', questionHandlers.deleteQuestion)

router.get('/users/:id', userHandlers.getUser)
router.post('/users', userHandlers.createUser)
router.put('/users', userHandlers.updateUser)
router.delete('/users', userHandlers.deleteUser)

module.exports = router
