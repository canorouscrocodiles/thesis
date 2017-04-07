const app = require('./index')
const request = require('supertest')
const expect = require('chai').expect

describe('HTTP Server Tests', () => {
  it('Should return 200 OK', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
})
