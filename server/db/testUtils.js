const createTables = (db) => {
  return db.none(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    username VARCHAR (50) NOT NULL UNIQUE,
    email VARCHAR (50) NOT NULL,
    img_url VARCHAR (200),
    bio VARCHAR (250)
  );`)
  .then(() => db.none(`CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    updated_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    message VARCHAR (300) NOT NULL,
    coordinates VARCHAR (100) NOT NULL,
    location VARCHAR (100) NOT NULL,
    category_id INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
    );`))
  .then(() => db.none(`CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    message VARCHAR (300) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions ON DELETE CASCADE,
    vote_count INTEGER DEFAULT 0
    );`))
  .then(() => db.none(`CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    answer_id INTEGER NOT NULL REFERENCES answers ON DELETE CASCADE,
    vote_type INTEGER DEFAULT 0
    );`))
  .then(() => db.none(`CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(24) NOT NULL
    );`))
}

const truncateAndSeed = (db) => {
  return db.none('TRUNCATE users RESTART IDENTITY CASCADE')
  .then(() => db.none('TRUNCATE questions RESTART IDENTITY CASCADE'))
  .then(() => db.none('TRUNCATE answers RESTART IDENTITY CASCADE'))
  .then(() => db.none('TRUNCATE votes RESTART IDENTITY CASCADE'))
  .then(() => db.none('TRUNCATE categories RESTART IDENTITY CASCADE'))
  .then(() => db.none('INSERT INTO users (username, email, img_url, bio) VALUES ($1, $2, $3, $4)', ['JohnSmith', 'js@example.com', 'www.example.com/avatar.png', 'My first profile']))
  .then(() => db.none('INSERT INTO questions (user_id, message, coordinates, location, category_id, active) VALUES ($1, $2, $3, $4, $5, $6)', [1, 'Is Chipotle still open?', '{lat: 37.783494, lng: -122.407433}', '139 5th St', 1, 'true']))
  .then(() => db.none('INSERT INTO answers (user_id, question_id, message) VALUES ($1, $2, $3)', [1, 1, 'Yes, they always are open']))
  .then(() => db.none('INSERT INTO votes (user_id, answer_id, vote_type) VALUES ($1, $2, $3)', [1, 1, 1]))
  .then(() => db.none('INSERT INTO categories (name) VALUES ($1)', ['chipotle']))
  .catch((err) => {
    console.log('beforeEach failed with error: ', err)
    throw err
  })
}

module.exports = {
  truncateAndSeed: truncateAndSeed,
  createTables: createTables
}
