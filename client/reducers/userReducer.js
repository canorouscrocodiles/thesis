import { FETCHING_USER, SET_USER, FETCH_USER_ERROR, SET_USER_QUESTIONS, SET_USER_ANSWERS } from '../actions/user'

const initialState = {data: null, questions: [], answers: null, fetching: false, error: null}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_USER:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case SET_USER:
      return {
        ...state,
        data: action.data,
        fetching: false
      }
    case SET_USER_QUESTIONS:
      console.log('Setting user questions ', action.data)
      return {
        ...state,
        questions: action.data
      }
    case SET_USER_ANSWERS:
      return {
        ...state,
        answers: action.data
      }
    case FETCH_USER_ERROR:
      return {
        ...state,
        error: action.data,
        fetching: false
      }
    default:
      return state
  }
}
