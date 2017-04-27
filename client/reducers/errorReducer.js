import { SHOW_ERROR_NOTIFICATION, REMOVE_ERROR_NOTIFICATION } from '../actions/errors'

let initialState = null

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ERROR_NOTIFICATION:
      return action.data
    case REMOVE_ERROR_NOTIFICATION:
      return initialState
    default:
      return state
  }
}
