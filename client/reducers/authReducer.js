import {
  AUTHORIZING,
  SUCCESSFULLY_AUTHORIZED,
  LOGGING_OUT,
  SUCCESSFULLY_LOGGED_OUT,
  LOGGING_OUT_ERROR
} from '../actions/auth'

const initialState = { authorizing: false, loggingOut: false, error: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHORIZING:
      return {
        ...state,
        authorizing: true
      }
    case SUCCESSFULLY_AUTHORIZED:
      return {
        ...state,
        authorizing: false
      }
    case LOGGING_OUT:
      return {
        ...state,
        loggingOut: true
      }
    case SUCCESSFULLY_LOGGED_OUT:
      return {
        ...state,
        loggingOut: false
      }
    case LOGGING_OUT_ERROR:
      return {
        ...state,
        loggingOut: false,
        error: action.data
      }
    default:
      return state
  }
}
