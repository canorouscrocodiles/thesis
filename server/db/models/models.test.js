const db = require('../index')
const answerQueries = require('./answers')
const questionQueries = require('./questions')
const userQueries = require('./users')
const voteQueries = require('./votes')

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

describe('Database user queries ', () => {
  beforeEach(() => truncateAndSeed())

  it('selects a user', () => {
    return userQueries.selectUser(1)
    .then(result => expect(result.username).toBe('JohnSmith'))
    .catch(err => { throw err })
  })

  it('inserts a user', () => {
    const user = {username: 'Craig R', email: 'craigr@example.com', img_url: 'www.google.com/flamingunicorn.png', bio: 'I ride with the wind'}
    return userQueries.insertUser(user)
    .then(() => db.one('SELECT * FROM users WHERE id = 2'))
    .then(result => expect(result.username).toBe(user.username))
    .catch(err => { throw err })
  })

  it('updates a user', () => {
    const user = {id: 1, username: 'JohnSmith', email: 'js@example.com', img_url: 'www.example.com/avatar.png', bio: 'I updated my profile'}
    return userQueries.updateUser(user)
    .then(() => db.one('SELECT * FROM users WHERE id = 1'))
    .then(result => expect(result.bio).toBe(user.bio))
    .catch(err => { throw err })
  })

  it('deletes a user', () => {
    return userQueries.deleteUser(1)
    .then(() => db.oneOrNone('SELECT * FROM users WHERE id = 1'))
    .then(result => expect(result).toBe(null))
    .catch(err => { throw err })
  })
})

describe('Database question queries', () => {
  beforeEach(() => truncateAndSeed())

  it('selects all questions', () => {
    return questionQueries.selectQuestions()
    .then(result => expect(result[0].message).toBe('Is Chipotle still open?'))
    .catch(err => { throw err })
  })

  it('selects a single question', () => {
    return questionQueries.selectQuestion(1)
    .then(result => expect(result.message).toBe('Is Chipotle still open?'))
    .catch(err => { throw err })
  })

  it('inserts a single question', () => {
    const question = {user_id: 1, message: 'What is the weather like outside?', coordinates: '{lat: 82.61723989, lng: -122.9553215}', location: '123 St. Johns Drive, San Francisco, Ca 90000'}
    return questionQueries.insertQuestion(question)
    .then(() => db.one('SELECT * FROM questions WHERE id = 2'))
    .then(result => expect(result.message).toBe('What is the weather like outside?'))
    .catch(err => { throw err })
  })

  it('updates a single question', () => {
    const question = {user_id: 1, message: 'What is the weather like outside near the corner of...?', coordinates: '{lat: 82.61723989, lng: -122.9553215}', location: '123 St. Johns Drive, San Francisco, Ca 90000'}
    return questionQueries.updateQuestion(question)
    .then(() => db.one('SELECT * FROM questions WHERE id = 1'))
    .then(result => expect(result.message).toBe('What is the weather like outside near the corner of...?'))
    .catch(err => { throw err })
  })

  it('deletes a single question', () => {
    return questionQueries.deleteQuestion(1)
    .then(() => db.oneOrNone('SELECT * FROM questions WHERE id = 1'))
    .then(result => expect(result).toBe(null))
    .catch(err => { throw err })
  })
})

describe('Database answer queries', () => {
  beforeEach(() => truncateAndSeed())

  it('selects all users answers', () => {
    return answerQueries.selectAnswers(1)
    .then(result => expect(result[0].message).toBe('Yes, they always are open'))
    .catch(err => { throw err })
  })

  it('inserts an answer', () => {
    const answer = { user_id: 1, message: 'They\'re about to close', question_id: 1 }
    return answerQueries.insertAnswer(answer)
    .then(() => db.one('SELECT * FROM answers WHERE id = 2'))
    .then(result => expect(result.message).toBe('They\'re about to close'))
    .catch(err => { throw err })
  })

  it('updates a single answer', () => {
    const answer = { user_id: 1, message: 'Nevermind, they\'re about to close', question_id: 1 }
    return answerQueries.updateAnswer(answer)
    .then(() => db.one('SELECT * FROM answers WHERE id = 1'))
    .then(result => expect(result.message).toBe('Nevermind, they\'re about to close'))
    .catch(err => { throw err })
  })

  it('deletes a single answer', () => {
    return answerQueries.deleteAnswer(1)
    .then(() => db.oneOrNone('SELECT * FROM answers WHERE id = 1'))
    .then(result => expect(result).toBe(null))
    .catch(err => { throw err })
  })
})

describe('Database vote queries', () => {
  beforeEach(() => truncateAndSeed())

  it('updates a vote', () => {
    const vote = {id: 1, vote_type: -1, answer_id: 1}
    return voteQueries.updateVote(vote)
    .then(() => db.one('SELECT * FROM votes WHERE id = 1'))
    .then(result => expect(result.vote_type).toBe(-1))
    .catch(err => { throw err })
  })
})
