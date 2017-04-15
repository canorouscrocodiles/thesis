import { createStore, applyMiddleware, compose } from 'redux'
import io from 'socket.io-client'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/index'
import reduxSocket from 'redux-socket.io'

const socket = io('/')
const pessimisticExecute = (action, emit, next, dispatch) => {
  emit('action', action)
}
const socketMiddleware = reduxSocket(socket, ['post/', 'get/', 'put/', 'delete/', 'enter/', 'leave/'], { execute: pessimisticExecute })

const logger = createLogger()
const middlewares = applyMiddleware(thunk, logger, socketMiddleware)
const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const enhancers = compose(
  middlewares,
  reduxDevTool
)

// Possibly place pre-loaded state as 2nd arg here.
// It can be retrieved from local storage (ie, maybe users location?) or from the server
const store = createStore(rootReducer, enhancers)

export default store
