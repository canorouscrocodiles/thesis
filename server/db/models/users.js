const db = require('../index')

const selectUser = (id) => db.oneOrNone(`SELECT * from users WHERE id = ${id}`)

const insertUser = ({ id, username, email, img_url, bio }) => db.oneOrNone(`INSERT INTO users (id, username, email, img_url, bio) VALUES (${id}, $$'${username}'$$, $$'${email}'$$, $$'${img_url}'$$, $$'${bio}'$$) ON CONFLICT (id) DO UPDATE SET id = ${id} RETURNING *`)

const updateUser = ({ id, username, email, img_url, bio }) => db.none(`UPDATE users SET username = $$'${username}'$$, email = $$'${email}'$$, img_url = $$'${img_url}'$$, bio = $$'${bio}'$$ WHERE id = ${id}`)

const deleteUser = (id) => db.none(`DELETE FROM users WHERE id = ${id}`)

const verifyUser = (id) => db.query(`SELECT EXISTS(SELECT * FROM users WHERE id=${id})`)

module.exports = {
  selectUser: selectUser,
  insertUser: insertUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  verifyUser: verifyUser
}
