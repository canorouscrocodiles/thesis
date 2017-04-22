import axios from 'axios'

export const QUESTIONS_REQUEST_SENT = 'QUESTIONS_REQUEST_SENT'
export const QUESTIONS_REQUEST_ERROR = 'QUESTIONS_REQUEST_ERROR'
export const SELECT_SINGLE_QUESTION = 'SELECT_SINGLE_QUESTION'
export const SINGLE_QUESTION_RECEIVED = 'SINGLE_QUESTION_RECEIVED'
export const QUESTION_DEACTIVATE_REQUEST = 'QUESTION_DEACTIVATE_REQUEST'
export const QUESTION_DEACTIVATE_SUCCESS = 'QUESTION_DEACTIVATE_SUCCESS'
export const QUESTION_DEACTIVATE_FAILURE = 'QUESTION_DEACTIVATE_FAILURE'

export const signalQuestionsRequest = () => ({ type: QUESTIONS_REQUEST_SENT })
const setSingleQuestion = question => ({ type: SINGLE_QUESTION_RECEIVED, data: question })
const signalRequestError = (error) => ({ type: QUESTIONS_REQUEST_ERROR, data: error })
export const selectSingleQuestion = (id) => ({ type: SELECT_SINGLE_QUESTION, data: id })
const signalQuestionDeactivation = () => ({ type: QUESTION_DEACTIVATE_REQUEST })
const signalQuestionDeactivationSuccess = () => ({ type: QUESTION_DEACTIVATE_SUCCESS })
const signalQuestionDeactivationFailure = () => ({ type: QUESTION_DEACTIVATE_FAILURE })

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

export const deactivateQuestion = (id) => {
  return dispatch => {
    dispatch(signalQuestionDeactivation())

    axios.put(`/api/questions/${id}?deactivate=true`)
    .then(() => dispatch(signalQuestionDeactivationSuccess()))
    .catch(() => dispatch(signalQuestionDeactivationFailure()))
  }
}
