const { app } = require('./index')
const request = require('supertest')
const Answer = require('./answers')
const Questions = require('./questions')
const Users = require('./users')
const Votes = require('./votes')

describe('Answer Handler Tests', () => {
  it('Should return answers to a question given a question_id', done => {
    request(app)
      .get('/api/answers')
      .field('id', '1')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.Anything())
        done()
      })
  })
})
