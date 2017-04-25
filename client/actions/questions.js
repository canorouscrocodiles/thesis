import axios from 'axios'

export const QUESTIONS_REQUEST_SENT = 'QUESTIONS_REQUEST_SENT'
export const QUESTIONS_REQUEST_ERROR = 'QUESTIONS_REQUEST_ERROR'
export const SINGLE_QUESTION_RECEIVED = 'SINGLE_QUESTION_RECEIVED'
export const SORT_QUESTIONS = 'SORT_QUESTIONS'
export const MARK_QUESTIONS_AS_READ = 'MARK_QUESTIONS_AS_READ'
export const CHANGE_OPTION = 'CHANGE_OPTION'
export const CHANGE_VALUE = 'CHANGE_VALUE'

export const signalQuestionsRequest = () => ({ type: QUESTIONS_REQUEST_SENT })
export const markQuestionsAsRead = () => ({ type: MARK_QUESTIONS_AS_READ })
export const changeOption = (option) => ({ type: CHANGE_OPTION, data: option })
export const changeValue = (value) => ({ type: CHANGE_VALUE, data: value })

export const sortQuestions = (sortBy, categories) => {
  return {
    type: SORT_QUESTIONS,
    sortBy,
    categories
  }
}
