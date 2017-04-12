const Users  = require('../db/models/users')

const getUser = (req, res) => {
  const id = req.params.id
  Users.selectUser(id)
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.log(err);
    res.status(500).send(err)
  })
}

const createUser = (req, res) => {
  const { username, email, img_url, bio } = req.body
  Users.insertUser({ username, email, img_url, bio })
  .then(() => res.sendStatus(201))
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })
}

const updateUser = (req, res) => {
  const { id, username, email, img_url, bio } = req.body
  Users.updateUser({ id, username, email, img_url, bio })
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })
}

const deleteUser = (req, res) => {
  const id = req.body.id
  Users.deleteUser(id)
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })
}

module.exports = {
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}
