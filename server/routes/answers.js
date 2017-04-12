const Answers = require('../db/models/answers')

const getAnswers = (req, res) => {
  const id = req.params.id
  Answers.selectAnswers(id)
    .then(answers => res.status(200).send(answers))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

const postAnswer = (req, res) => {
  const { message, user_id, question_id } = req.body
  Answers.insertAnswer({message, user_id, question_id})
    .then(() => res.sendStatus(201))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

const deleteAnswer = (req, res) => {
  const id = req.body.id
  Answers.deleteAnswer(id)
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

const updateAnswer = (req, res) => {
  const { id, message } = req.body
  Answers.updateAnswer({id, message})
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.log(`Error: ${error}`)
      res.sendStatus(500)
    })
}

module.exports = {
  getAnswers: getAnswers,
  postAnswer: postAnswer,
  deleteAnswer: deleteAnswer,
  updateAnswer: updateAnswer
}
