const db = require('../db/models/answers')

const getAnswers = (req, res) => {
  // const id = req.body.id
  // db.selectAnswers(id)
  // .then(answers => res.status(200).json(answers))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const postAnswer = (req, res) => {
  // const { message, user_id, question_id } = req.body
  // db.insertAnswer({message, user_id, question_id})
  // .then(() => res.sendStatus(201))
  // .catch(() => res.sendStatus(401))
  res.sendStatus(201)
}

const deleteAnswer = (req, res) => {
  // const id = req.body.id
  // db.deleteAnswer(id)
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const updateAnswer = (req, res) => {
  // const { message, user_id, question_id } = req.body
  // db.updateAnswer({message, user_id, question_id})
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

module.exports = {
  getAnswers: getAnswers,
  postAnswer: postAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
