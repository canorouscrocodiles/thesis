import { FETCHING_USER, SET_USER, FETCH_USER_ERROR, SET_USER_QUESTIONS, SET_USER_ANSWERS, SELECT_SINGLE_USER_QUESTION } from '../actions/user'

const initialState = {data: null, questions: [], selectedQuestion: null, answers: null, fetching: false, error: null}

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
    case SELECT_SINGLE_USER_QUESTION:
      const singleQuestion = state.questions.find(question => question.id === parseInt(action.data))
      return {
        ...state,
        selectedQuestion: singleQuestion
      }
    default:
      return state
  }
}
