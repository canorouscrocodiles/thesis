const db = require('../index')
const answerQueries = require('./answers')
const questionQueries = require('./questions')
const userQueries = require('./users')
const voteQueries = require('./votes')
const { deleteTables, createTables, truncateTables, seedTestData, seedDummyData } = require('./../testUtils')

// deleteTables should be used during testing/dev phases only

beforeAll(() => deleteTables(db).then(() => createTables(db)))
afterAll(() => truncateTables(db).then(() => seedDummyData(db)))

describe('Database user queries ', () => {
  beforeEach(() => truncateTables(db).then(() => seedTestData(db)))

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
  beforeEach(() => truncateTables(db).then(() => seedTestData(db)))

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
    const question = {user_id: 1, message: 'What is the weather like outside?', coordinates: '{lat: 82.61723989, lng: -122.9553215}', location: '123 St. Johns Drive, San Francisco, Ca 90000', category_id: 1}
    return questionQueries.insertQuestion(question)
    .then(() => db.one('SELECT * FROM questions WHERE id = 2'))
    .then(result => expect(result.message).toBe('What is the weather like outside?'))
    .catch(err => { throw err })
  })

  it('updates a single question', () => {
    const question = {id: 1, message: 'What is the weather like outside near the corner of...?', coordinates: '{lat: 82.61723989, lng: -122.9553215}', location: '123 St. Johns Drive, San Francisco, Ca 90000', category_id: 1}
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
  beforeEach(() => truncateTables(db).then(() => seedTestData(db)))

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
    const answer = { id: 1, message: 'Nevermind, they\'re about to close', question_id: 1 }
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
  beforeEach(() => truncateTables(db).then(() => seedTestData(db)))

  it('updates a vote', () => {
    const vote = { user_id: 1, vote_type: -1, answer_id: 1 }
    return voteQueries.updateVote(vote)
    .then(() => db.one('SELECT * FROM votes WHERE id = 1'))
    .then(result => expect(result.vote_type).toBe(-1))
    .catch(err => { throw err })
  })
})
