const db = require('../db/models/users')

const getUser = (req, res) => {
  // const id = req.body.id
  // db.selectUser(id)
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const createUser = (req, res) => {
  // const { id, username, email, img_url, bio } = req.body
  // db.insertUser({ id, username, email, img_url, bio })
  // .then(() => res.sendStatus(201))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(201)
}

const updateUser = (req, res) => {
  // const { id, username, email, img_url, bio } = req.body
  // db.updateUser({ id, username, email, img_url, bio })
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

const deleteUser = (req, res) => {
  // const id = req.body.id
  // db.deleteUser(id)
  // .then(() => res.sendStatus(200))
  // .catch(() => res.sendStatus(404))
  res.sendStatus(200)
}

module.exports = {
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}
