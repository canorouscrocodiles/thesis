import { createStore, applyMiddleware, compose } from 'redux'
import io from 'socket.io-client'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/index'
import reduxSocket from 'redux-socket.io'
import cookie from 'react-cookie'

const socket = io('/')
const pessimisticExecute = (action, emit, next, dispatch) => {
  let token = cookie.select(/(onpoint-bearer)/g)['onpoint-bearer']
  action.token = token
  emit('action', action)
}
const socketMiddleware = reduxSocket(socket, ['post/', 'get/', 'put/', 'delete/', 'enter/', 'leave/'], { execute: pessimisticExecute })

const logger = createLogger()
const middlewares = applyMiddleware(thunk, logger, socketMiddleware)

let enhancers = compose(middlewares)
if (process.env.NODE_ENV === 'development') {
  const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  enhancers = compose(
    middlewares,
    reduxDevTool
  )
} else {
  enhancers = compose(middlewares)
}

// Possibly place pre-loaded state as 2nd arg here.
// It can be retrieved from local storage (ie, maybe users location?) or from the server
const store = createStore(rootReducer, enhancers)

export default store
