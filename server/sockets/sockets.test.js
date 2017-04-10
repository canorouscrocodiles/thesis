const socket = require('socket.io-client')
const { io, server } = require('../index')
const url = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 8080

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
