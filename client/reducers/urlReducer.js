import { SET_URL, URL_RESET } from '../actions/url'

export default (state = null, action) => {
  switch (action.type) {
    case SET_URL:
      return action.data
    case URL_RESET:
      return null
    default:
      return state
  }
}
