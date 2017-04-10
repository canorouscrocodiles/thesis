const db = require('./index')

beforeAll(() => createTables())

afterAll(() => truncateAndSeed())

const createTables = () => {
  return db.none(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    username VARCHAR (50) NOT NULL UNIQUE,
    email VARCHAR (50) NOT NULL,
    img_url VARCHAR (100),
    bio VARCHAR (100)
  );`)
  .then(() => db.none(`CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    updated_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    message VARCHAR (300) NOT NULL,
    coordinates VARCHAR (100) NOT NULL,
    location VARCHAR (100) NOT NULL
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
    name VARCHAR(24) NOT NULL,
    question_id INTEGER NOT NULL REFERENCES questions ON DELETE CASCADE
    );`))
}

const truncateAndSeed = () => {
  return db.none('TRUNCATE users RESTART IDENTITY CASCADE')
  .then(() => db.none('TRUNCATE questions RESTART IDENTITY CASCADE'))
  .then(() => db.none('TRUNCATE answers RESTART IDENTITY CASCADE'))
  .then(() => db.none('TRUNCATE votes RESTART IDENTITY CASCADE'))
  .then(() => db.none('TRUNCATE categories RESTART IDENTITY CASCADE'))
  .then(() => db.none('INSERT INTO users (username, email, img_url, bio) VALUES ($1, $2, $3, $4)', ['JohnSmith', 'js@example.com', 'www.example.com/avatar.png', 'My first profile']))
  .then(() => db.none('INSERT INTO questions (user_id, message, coordinates, location) VALUES ($1, $2, $3, $4)', [1, 'Is Chipotle still open?', '{lat: 82.61723989, lng: -122.9553215}', '123 St. Johns Drive, San Francisco, Ca 90000']))
  .then(() => db.none('INSERT INTO answers (user_id, question_id, message) VALUES ($1, $2, $3)', [1, 1, 'Yes, they always are open']))
  .then(() => db.none('INSERT INTO votes (user_id, answer_id, vote_type) VALUES ($1, $2, $3)', [1, 1, 1]))
  .then(() => db.none('INSERT INTO categories (name, question_id) VALUES ($1, $2)', ['chipotle', 1]))
  .catch((err) => {
    console.log('beforeEach failed with error: ', err)
    throw err
  })
}

describe('Database tables: ', () => {
  beforeEach(() => truncateAndSeed())

  test('user table exists with one record', () => {
    const username = 'JohnSmith'
    return db
      .one('SELECT * FROM users where username = $1', [username])
      .then(u => {
        expect(u.username).toBe(username)
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  })

  test('question table exists with one record', () => {
    return db
      .one('SELECT * FROM questions WHERE user_id = $1', [1])
      .then(question => {
        expect(question.message).toBe('Is Chipotle still open?')
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  })

  test('answers table exists with one record', () => {
    return db
      .one('SELECT * FROM answers WHERE user_id = $1 AND question_id = $2', [1, 1])
      .then(answer => {
        expect(answer.message).toBe('Yes, they always are open')
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  })

  test('votes table exists with one record', () => {
    return db
      .one('SELECT * FROM votes where user_id = $1 AND answer_id = $2', [1, 1])
      .then(vote => {
        expect(vote.vote_type).toBe(1)
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  })

  test('categories table exists with one record', () => {
    return db
      .one('SELECT * FROM categories where question_id = $1', [1])
      .then(category => {
        expect(category.name).toBe('chipotle')
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  })
})
