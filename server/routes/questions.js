const db = require('../db/models/questions')

const getQuestions = (req, res) => {
  // get all(mvp)/trending questions within radius
  // db.selectQuestions()
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const getQuestion = (req, res) => {
  // const id = req.body.id
  // db.selectQuestion(id)
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const createQuestion = (req, res) => {
  // const { message, coordinates, location } = req.body
  // db.insertQuestion({ message, coordinates, location })
  // .then(() => res.sendStatus(201))
  // .catch(() => res.sendStatus(401))
  res.sendStatus(201)
}

const updateQuestion = (req, res) => {
  // const { user_id, message, coordinates, location } = req.body
  // db.updateQuestion({ user_id, message, coordinates, location })
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const deleteQuestion = (req, res) => {
  // const id = req.body.id
  // db.deleteQuestion(id)
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

module.exports = {
  getQuestions: getQuestions,
  getQuestion: getQuestion,
  createQuestion: createQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}
