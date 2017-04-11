const Answers = require('../db/models/answers')

const getAnswers = (req, res) => {
  const id = req.body.id
  Answers.selectAnswers(id)
    .then(answers => res.status(200).json(answers))
    .catch(() => res.sendStatus(404))
}

const postAnswer = (req, res) => {
  const { message, user_id, question_id } = req.body
  Answers.insertAnswer({message, user_id, question_id})
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(401))
}

const deleteAnswer = (req, res) => {
  const id = req.body.id
  Answers.deleteAnswer(id)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404))
}

const updateAnswer = (req, res) => {
  const { message, user_id, question_id } = req.body
  Answers.updateAnswer({message, user_id, question_id})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404))
}

module.exports = {
  getAnswers: getAnswers,
  postAnswer: postAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
