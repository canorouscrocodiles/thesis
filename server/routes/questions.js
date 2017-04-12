const Questions = require('../db/models/questions')

const getQuestions = (req, res) => {
  Questions.selectQuestions()
    .then(questions => res.status(200).send(questions))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

const getQuestion = (req, res) => {
  const id = req.body.id
  Questions.selectQuestion(id)
    .then(question => res.status(200).send(question))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

const createQuestion = (req, res) => {
  const { message, coordinates, location } = req.body
  Questions.insertQuestion({ message, coordinates, location })
    .then(() => res.sendStatus(201))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

const updateQuestion = (req, res) => {
  const { user_id, message, coordinates, location } = req.body
  Questions.updateQuestion({ user_id, message, coordinates, location })
  .then(() => res.sendStatus(200))
  .catch(error => {
    console.log(`Error: ${error}`)
    res.sendStatus(500)
  })
}

const deleteQuestion = (req, res) => {
  const id = req.body.id
  Questions.deleteQuestion(id)
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

module.exports = {
  getQuestions: getQuestions,
  getQuestion: getQuestion,
  createQuestion: createQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}
