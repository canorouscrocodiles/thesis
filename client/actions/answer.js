import axios from 'axios'

export const ANSWERS_REQUEST_SENT = 'ANSWERS_REQUEST_SENT'
export const ANSWERS_REQUEST_RECEIVED = 'ANSWERS_REQUEST_RECEIVED'
export const ANSWERS_REQUEST_ERROR = 'ANSWERS_REQUEST_ERROR'
export const SET_ANSWERS = 'SET_ANSWERS'
export const POST_ANSWER = 'POST_ANSWER'

const signalAnswersRequest = () => ({ type: ANSWERS_REQUEST_SENT })
const signalRequestError = (error) => ({ type: ANSWERS_REQUEST_ERROR, data: error })
const setAnswers = (answers) => ({ type: ANSWERS_REQUEST_RECEIVED, data: answers })

export const fetchAnswers = (id) => {
  return dispatch => {
    dispatch(signalAnswersRequest())

    // Get all answers from one user
    axios.get(`/api/answers/${id}`)
      .then(answers => dispatch(setAnswers(answers.data)))
      .catch(error => dispatch(signalRequestError(error)))
  }
}
