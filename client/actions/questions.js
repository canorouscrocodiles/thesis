import axios from 'axios'

export const QUESTIONS_REQUEST_SENT = 'QUESTIONS_REQUEST_SENT'
export const QUESTIONS_REQUEST_ERROR = 'QUESTIONS_REQUEST_ERROR'
export const SELECT_SINGLE_QUESTION = 'SELECT_SINGLE_QUESTION'
export const SINGLE_QUESTION_RECEIVED = 'SINGLE_QUESTION_RECEIVED'
export const SORT_QUESTIONS = 'SORT_QUESTIONS'
export const QUESTION_DEACTIVATE_REQUEST = 'QUESTION_DEACTIVATE_REQUEST'
export const QUESTION_DEACTIVATE_SUCCESS = 'QUESTION_DEACTIVATE_SUCCESS'
export const QUESTION_DEACTIVATE_FAILURE = 'QUESTION_DEACTIVATE_FAILURE'
export const MARK_QUESTIONS_AS_READ = 'MARK_QUESTIONS_AS_READ'
export const CHANGE_OPTION = 'CHANGE_OPTION'
export const CHANGE_VALUE = 'CHANGE_VALUE'

export const signalQuestionsRequest = () => ({ type: QUESTIONS_REQUEST_SENT })
export const selectSingleQuestion = (id) => ({ type: SELECT_SINGLE_QUESTION, data: id })
export const markQuestionsAsRead = () => ({ type: MARK_QUESTIONS_AS_READ })
export const changeOption = (option) => ({ type: CHANGE_OPTION, data: option })
export const changeValue = (value) => ({ type: CHANGE_VALUE, data: value })
const setSingleQuestion = question => ({ type: SINGLE_QUESTION_RECEIVED, data: question })
const signalRequestError = (error) => ({ type: QUESTIONS_REQUEST_ERROR, data: error })

export const sortQuestions = (sortBy, categories) => {
  return {
    type: SORT_QUESTIONS,
    sortBy,
    categories
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
