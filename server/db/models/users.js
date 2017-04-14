const db = require('../index')

const selectUser = (id) => db.oneOrNone('SELECT * from users WHERE id = $1', [id])

// const insertUser = ({ username, email, img_url, bio }) => db.oneOrNone('INSERT INTO users (username, email, img_url, bio) VALUES ($1, $2, $3, $4)', [username, email, img_url, bio])

const insertUser = ({ id, username, email, img_url, bio }) => db.oneOrNone(
  `INSERT INTO users (id, username, email, img_url, bio)
    VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (id) DO UPDATE SET id = $1
  RETURNING *;`, [id, username, email, img_url, bio])

const updateUser = ({ id, username, email, img_url, bio }) => db.none('UPDATE users SET username = $1, email = $2, img_url = $3, bio = $4 WHERE id = $5', [username, email, img_url, bio, id])

const deleteUser = (id) => db.none('DELETE FROM users WHERE id = $1', [id])

module.exports = {
  selectUser: selectUser,
  insertUser: insertUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}
