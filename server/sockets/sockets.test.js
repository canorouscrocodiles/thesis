const socket = require('socket.io-client')
const { io, server } = require('../index')

describe('Socket Tests', () => {
  it('Should emit Hello World', done => {
    server.listen(8080)
    let client = socket.connect('http://localhost:8080')
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
    server.listen(8080)
    let client = socket.connect('http://localhost:8080')
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
