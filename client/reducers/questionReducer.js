import {
  QUESTIONS_REQUEST_SENT, QUESTIONS_REQUEST_RECEIVED,
  QUESTIONS_REQUEST_ERROR, SELECT_SINGLE_QUESTION
} from '../actions/questions'
const initialState = {data: [], selectedQuestion: null, fetching: false, error: null}

export default (state = initialState, action) => {
  switch (action.type) {
    case QUESTIONS_REQUEST_SENT:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case QUESTIONS_REQUEST_RECEIVED:
      return {
        ...state,
        data: action.data,
        fetching: false
      }
    case QUESTIONS_REQUEST_ERROR:
      return {
        ...state,
        error: action.data
      }
    case SELECT_SINGLE_QUESTION:
      const index = state.data.findIndex(q => q.id === action.data)
      return {
        ...state,
        selectedQuestion: state.data[index]
      }
    default:
      return state
  }
}
