import {
  ANSWERS_REQUEST_SENT, ANSWERS_REQUEST_RECEIVED,
  ANSWERS_REQUEST_ERROR, SET_ANSWERS
} from '../actions/answer'
const initialState = { data: [], fetching: false, error: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case ANSWERS_REQUEST_SENT:
      return {
        ...state,
        fetching: true
      }
    case ANSWERS_REQUEST_RECEIVED:
      return {
        ...state,
        data: action.data,
        fetching: false
      }
    case ANSWERS_REQUEST_ERROR:
      return {
        ...state,
        error: action.data
      }
    default:
      return state
  }
}
