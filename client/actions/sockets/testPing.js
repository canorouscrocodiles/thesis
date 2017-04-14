const SOCKET_TEST = 'get/helloworld'
const SERVER_TO_CLIENT_TEST_PING = 'SERVER_TO_CLIENT_TEST_PING'
// export const CLIENT_TO_SERVER_TEST_PING = 'CLIENT_TO_SERVER_TEST_PING'
const testSocketPing = () => ({ type: SOCKET_TEST })

module.exports = {
  SERVER_TO_CLIENT_TEST_PING: SERVER_TO_CLIENT_TEST_PING,
  testSocketPing: testSocketPing
}
