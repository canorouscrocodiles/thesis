import {
  ANSWERS_REQUEST_SENT, USER_ANSWERS_REQUEST_RECEIVED,
  ANSWERS_REQUEST_ERROR, QUESTION_ANSWERS_REQUEST_RECEIVED, SUCCESSFUL_POST_ANSWER, FAILED_POST_ANSWER
} from '../actions/answer'
import { sendNotification } from '../actions/notifications'
const initialState = { data: [], userAnswers: [], fetching: false, error: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case ANSWERS_REQUEST_SENT:
      return {
        ...state,
        fetching: true
      }
    case USER_ANSWERS_REQUEST_RECEIVED:
      return {
        ...state,
        userAnswers: action.data,
        fetching: false
      }
    case QUESTION_ANSWERS_REQUEST_RECEIVED:
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
    case SUCCESSFUL_POST_ANSWER:
      let path = window.location.pathname.split('/')
      let qID = parseInt(path[2])
      if (qID !== action.data.question_id) {
        sendNotification(action.data)
        return { ...state }
      } else {
        return {
          ...state,
          data: [
            ...state.data,
            action.data
          ]
        }
      }
    case FAILED_POST_ANSWER:
      return {
        ...state,
        error: action.data
      }
    default:
      return state
  }
}
