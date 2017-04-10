const socket = require('socket.io-client')
const { io, server } = require('../index')
let url = process.env.HEROKU_APP_NAME || 'http://localhost'
const port = process.env.PORT || 8080

if (process.env.HEROKU_APP_NAME) {
  url = `http://${url}.herokuapp.com`
}

console.log(`
  URL = ${url}
  PORT = ${port}
`)

describe('Socket Tests', () => {
  it('Should emit Hello World', done => {
    server.listen(port)
    let client = socket.connect(`${url}:${port}`)
    client.on('connect', () => {
      client.on('echo', data => {
        expect(data).toEqual('Hello World')
        client.disconnect()
        server.close()

        done()
      })
    })
  })
  it('Should emit one client', done => {
    server.listen(port)
    let client = socket.connect(`${url}:${port}`)
    client.on('connect', () => {
      client.on('clients', data => {
        let result = Object.keys(data)
        expect(result.length).toEqual(1)
        client.disconnect()
        server.close()

        done()
      })
    })
  })
})
