const { app } = require('./index')
const request = require('supertest')

describe('HTTP Server Tests', () => {
  it('Should return 200 OK', done => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
})

describe('Router Tests', () => {
  it('Should return 200 on a GET request to /api/questions', done => {
    request(app)
      .get('/api/questions')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 201 on a POST request to /api/questions', done => {
    request(app)
      .post('/api/questions')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 201 on a POST request to /api/answers', done => {
    request(app)
      .post('/api/answers')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 200 on a GET request to /api/users', done => {
    request(app)
      .get('/api/users')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 201 on a POST request to /api/users', done => {
    request(app)
      .post('/api/users')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 200 on a PUT request to /api/users', done => {
    request(app)
      .put('/api/users')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 200 on a DELETE request to /api/users', done => {
    request(app)
      .delete('/api/users')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
  it('Should return 200 on a PUT request to /api/votes', done => {
    request(app)
      .put('/api/votes')
      .end((err, res) => {
        if (err) throw err
        expect(res).toEqual(expect.anything())
        done()
      })
  })
})
