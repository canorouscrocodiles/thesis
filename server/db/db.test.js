const db = require('./index')
const { deleteTables, createTables, truncateTables, seedTestData, seedDummyData } = require('./testUtils')

beforeAll(() => deleteTables(db).then(() => createTables(db)))
afterAll(() => truncateTables(db).then(() => seedDummyData(db)))

describe('Database tables: ', () => {
  beforeEach(() => truncateTables(db).then(() => seedTestData(db)))

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
      .one('SELECT * FROM categories where id = $1', [1])
      .then(category => {
        expect(category.name).toBe('chipotle')
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  })
})
