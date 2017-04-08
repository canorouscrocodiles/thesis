const app = require('./index')
const request = require('supertest')

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

describe('Router Tests', () => {
  it('Should return 200 on a GET request to /api/questions', done => {
    request(app)
      .get('/api/questions')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
  it('Should return 201 on a POST request to /api/questions', done => {
    request(app)
      .post('/api/questions')
      .expect(201)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
  it('Should return 201 on a POST request to /api/answers', done => {
    request(app)
      .post('/api/answers')
      .expect(201)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
  it('Should return 200 on a GET request to /api/users', done => {
    request(app)
      .get('/api/users')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
  it('Should return 201 on a POST request to /api/users', done => {
    request(app)
      .post('/api/users')
      .expect(201)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
  it('Should return 200 on a PUT request to /api/users', done => {
    request(app)
      .put('/api/users')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
  it('Should return 200 on a DELETE request to /api/users', done => {
    request(app)
      .delete('/api/users')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
})
