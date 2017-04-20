import axios from 'axios'

export const ANSWERS_REQUEST_SENT = 'ANSWERS_REQUEST_SENT'
export const QUESTION_ANSWERS_REQUEST_RECEIVED = 'QUESTION_ANSWERS_REQUEST_RECEIVED'
export const USER_ANSWERS_REQUEST_RECEIVED = 'USER_ANSWERS_REQUEST_RECEIVED'
export const ANSWERS_REQUEST_ERROR = 'ANSWERS_REQUEST_ERROR'
export const SUCCESSFUL_POST_ANSWER = 'SUCCESSFUL_POST_ANSWER'
export const FAILED_POST_ANSWER = 'FAILED_POST_ANSWER'
export const SORT_ANSWERS = 'SORT_ANSWERS'

const signalAnswersRequest = () => ({ type: ANSWERS_REQUEST_SENT })
const signalRequestError = (error) => ({ type: ANSWERS_REQUEST_ERROR, data: error })
const setUserAnswers = (answers) => ({ type: USER_ANSWERS_REQUEST_RECEIVED, data: answers })
const setQuestionAnswers = (answers) => ({ type: QUESTION_ANSWERS_REQUEST_RECEIVED, data: answers })

export const sortAnswers = (sortBy) => {
  return { type: SORT_ANSWERS, sortBy: sortBy }
}

export const fetchUserAnswers = (id) => {
  return dispatch => {
    dispatch(signalAnswersRequest())

    // Get all answers from one user
    axios.get(`/api/answers/${id}`)
      .then(answers => dispatch(setUserAnswers(answers.data)))
      .catch(error => dispatch(signalRequestError(error)))
  }
}

export const fetchQuestionAnswers = (id, user_id) => {
  return dispatch => {
    dispatch(signalAnswersRequest())

    axios.post(`/api/questions/${id}/answers`, { user_id: user_id })
      .then(answers => dispatch(setQuestionAnswers(answers.data)))
      .catch(error => dispatch(signalRequestError(error)))
  }
}
