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
router.get('/questions/:id/answers', answerHandlers.getQuestionAnswers)
router.post('/questions', questionHandlers.getQuestions)
router.put('/questions', questionHandlers.updateQuestion)
router.delete('/questions', questionHandlers.deleteQuestion)

router.get('/users/:id', userHandlers.getUser)
router.get('/users/:id/questions', questionHandlers.getUserQuestions)
router.get('/users/:id/answers', answerHandlers.getUserAnswers)
router.post('/users', userHandlers.createUser)
router.put('/users', userHandlers.updateUser)
router.delete('/users', userHandlers.deleteUser)

module.exports = router
