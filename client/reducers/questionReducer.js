import {
  QUESTIONS_REQUEST_SENT, QUESTIONS_REQUEST_ERROR, SELECT_SINGLE_QUESTION, SINGLE_QUESTION_RECEIVED
} from '../actions/questions'
import { POST_QUESTION_SUCCESS, GET_QUESTION_SUCCESS } from '../actions/sockets/questions'
import { UPDATED_QUESTIONS_SUCCESS, UPDATED_QUESTIONS_FAILURE } from '../actions/sockets/location'
const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS'
const initialState = {data: [], selectedQuestion: {}, fetching: false, error: null}

export default (state = initialState, action) => {
  switch (action.type) {
    case QUESTIONS_REQUEST_SENT:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case QUESTIONS_REQUEST_ERROR:
      return {
        ...state,
        error: action.data
      }
    case GET_QUESTION_SUCCESS:
      return {
        ...state,
        selectedQuestion: action.data
      }
    case SINGLE_QUESTION_RECEIVED:
      return {
        ...state,
        selectedQuestion: action.data
      }
    case SELECT_SINGLE_QUESTION:
      const singleQuestion = state.data.find(question => question.id === parseInt(action.data))
      return {
        ...state,
        selectedQuestion: singleQuestion
      }
    case POST_QUESTION_SUCCESS:
      return {
        ...state,
        data: action.data,
        fetching: false
      }
    case UPDATED_QUESTIONS_SUCCESS:
      return {
        ...state,
        data: action.data,
        fetching: false
      }
    case UPDATED_QUESTIONS_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.data
      }
    case UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        selectedQuestion: {
          ...state.selectedQuestion,
          category_id: action.data.category_id,
          message: action.data.message
        }
      }
    default:
      return state
  }
}
