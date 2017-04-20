const Answers = require('../db/models/answers')
const ErrorResponseHandler = require('./error')

const getAnswers = (req, res) => {
  const id = req.params.id
  Answers.selectAnswers(id)
    .then(answers => res.status(200).send(answers))
    .catch(err => ErrorResponseHandler(err, res, 500))
}

const getQuestionAnswers = (req, res) => {
  const id = req.params.id
  Answers.selectQuestionAnswers(id)
    .then(answers => res.status(200).send(answers))
    .catch(err => ErrorResponseHandler(err, res, 500))
}

const getUserAnswers = (req, res) => {
  const id = req.params.id
  Answers.selectUserAnswers(id)
    .then(answers => res.status(200).send(answers))
    .catch(err => ErrorResponseHandler(err, res, 500))
}

const postAnswer = (req, res) => {
  const { message, user_id, question_id } = req.body
  Answers.insertAnswer({message, user_id, question_id})
    .then(() => res.sendStatus(201))
    .catch(err => ErrorResponseHandler(err, res, 500))
}

const deleteAnswer = (req, res) => {
  const id = req.body.id
  Answers.deleteAnswer(id)
    .then(() => res.sendStatus(200))
    .catch(err => ErrorResponseHandler(err, res, 500))
}

const updateAnswer = (req, res) => {
  const { id, message } = req.body
  Answers.updateAnswer({id, message})
    .then(() => res.sendStatus(200))
    .catch(err => ErrorResponseHandler(err, res, 500))
}

module.exports = {
  getAnswers: getAnswers,
  getQuestionAnswers: getQuestionAnswers,
  getUserAnswers: getUserAnswers,
  postAnswer: postAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
