import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/index';

const logger = createLogger()
const middlewares = applyMiddleware(thunk, logger)
const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const enhancers = compose(
  middlewares,
  reduxDevTool
)

// Possibly place pre-loaded state as 2nd arg here.
// It can be retrieved from local storage (ie, maybe users location?) or from the server
const store = createStore(rootReducer, enhancers)

export default store
