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

let middlewares
let enhancers

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger()
  const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  middlewares = applyMiddleware(thunk, logger, socketMiddleware)
  enhancers = compose(
    middlewares,
    reduxDevTool
  )
} else {
  middlewares = applyMiddleware(thunk, socketMiddleware)
  enhancers = compose(middlewares)
}

const store = createStore(rootReducer, enhancers)

export default store
