import cookie from 'react-cookie'
import { signalQuestionsRequest } from '../questions'

export const ENTER_QUESTION_ROOM_REQUEST = 'enter/'
export const ENTER_QUESTION_ROOM_SUCCESS = 'ENTER_QUESTION_ROOM_SUCCESS'
export const ENTER_QUESTION_ROOM_FAILED = 'ENTER_QUESTION_ROOM_FAILED'
export const LEAVE_QUESTION_ROOM_REQUEST = 'leave/'
export const LEAVE_QUESTION_ROOM_SUCCESS = 'LEAVE_QUESTION_ROOM_SUCCESS'
export const LEAVE_QUESTION_ROOM_FAILED = 'LEAVE_QUESTION_ROOM_FAILED'
const UPDATE_QUESTION_REQUEST = 'UPDATE_QUESTION_REQUEST'
const POST_QUESTION_REQUEST = 'post/question'
export const POST_QUESTION_SUCCESS = 'POST_QUESTION_SUCCESS'
export const GET_QUESTION_SUCCESS = 'GET_QUESTION_SUCCESS'
const SOCKET_GET_QUESTION = 'get/question'
const SOCKET_UPDATE_QUESTION = 'put/question'
export const GET_CATEGORIES_REQUEST = 'get/categories'
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS'
export const GET_CATEGORIES_FAILURE = 'GET_CATEGORIES_FAILURE'

export const enterRoom = (info) => ({ type: ENTER_QUESTION_ROOM_REQUEST, data: info })
export const leaveRoom = (info) => ({ type: LEAVE_QUESTION_ROOM_REQUEST, data: info })
const socketPostQuestion = (data) => ({ type: POST_QUESTION_REQUEST, data: data })
const sendSocketFetchQuestion = (id) => ({ type: SOCKET_GET_QUESTION, data: id })
const signalQuestionsUpdateRequest = () => ({ type: UPDATE_QUESTION_REQUEST })
const sendSocketUpdateQuestion = (data) => ({ type: SOCKET_UPDATE_QUESTION, data: data })
export const getCategories = () => ({ type: GET_CATEGORIES_REQUEST })

export const postQuestion = data => {
  // Extend data with JWT
  let token = cookie.select(/(onpoint-bearer)/g)['onpoint-bearer']
  Object.assign(data, {token})

  console.log(`Dispatching with token ${token}`)
  return dispatch => {
    dispatch(socketPostQuestion(data))
  }
}

export const socketFetchQuestion = (id) => {
  return dispatch => {
    dispatch(signalQuestionsRequest())

    id = parseInt(id)
    dispatch(sendSocketFetchQuestion(id))
  }
}

export const socketUpdateQuestion = data => {
  return dispatch => {
    dispatch(signalQuestionsUpdateRequest())
    dispatch(sendSocketUpdateQuestion(data))
  }
}
