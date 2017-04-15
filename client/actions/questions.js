import axios from 'axios'

export const QUESTIONS_REQUEST_SENT = 'QUESTIONS_REQUEST_SENT'
export const QUESTIONS_REQUEST_RECEIVED = 'QUESTIONS_REQUEST_RECEIVED'
export const QUESTIONS_REQUEST_ERROR = 'QUESTIONS_REQUEST_ERROR'
export const SET_QUESTIONS = 'SET_QUESTIONS'
export const SELECT_SINGLE_QUESTION = 'SELECT_SINGLE_QUESTION'
export const SINGLE_QUESTION_RECEIVED = 'SINGLE_QUESTION_RECEIVED'

export const signalQuestionsRequest = () => ({ type: QUESTIONS_REQUEST_SENT })
const setQuestions = questions => ({ type: QUESTIONS_REQUEST_RECEIVED, data: questions })
const setSingleQuestion = question => ({ type: SINGLE_QUESTION_RECEIVED, data: question })
const signalRequestError = (error) => ({ type: QUESTIONS_REQUEST_ERROR, data: error })
export const selectSingleQuestion = (id) => ({ type: SELECT_SINGLE_QUESTION, data: id })

export const fetchQuestions = () => {
  return dispatch => {
    dispatch(signalQuestionsRequest())

    axios.get('/api/questions')
    .then((questions) => dispatch(setQuestions(questions.data)))
    .catch((error) => dispatch(signalRequestError(error)))
  }
}

export const fetchSingleQuestion = (id) => {
  return dispatch => {
    dispatch(signalQuestionsRequest())

    id = parseInt(id)

    axios.get(`/api/questions/${id}`)
    .then((question) => {
      dispatch(setSingleQuestion(question.data))
    })
    .catch((error) => dispatch(signalRequestError(error)))
  }
}
