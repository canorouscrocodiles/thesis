import { signalQuestionsRequest } from '../questions'

export const ENTER_QUESTION_ROOM_REQUEST = 'enter/'
export const ENTER_QUESTION_ROOM_SUCCESS = 'ENTER_QUESTION_ROOM_SUCCESS'
export const ENTER_QUESTION_ROOM_FAILED = 'ENTER_QUESTION_ROOM_FAILED'
export const LEAVE_QUESTION_ROOM_REQUEST = 'leave/'
export const LEAVE_QUESTION_ROOM_SUCCESS = 'LEAVE_QUESTION_ROOM_SUCCESS'
export const LEAVE_QUESTION_ROOM_FAILED = 'LEAVE_QUESTION_ROOM_FAILED'
const POST_QUESTION_REQUEST = 'post/question'
export const POST_QUESTION_SUCCESS = 'POST_QUESTION_SUCCESS'
export const GET_QUESTION_SUCCESS = 'GET_QUESTION_SUCCESS'
const SOCKET_GET_QUESTION = 'get/question'

export const enterRoom = (id) => ({ type: ENTER_QUESTION_ROOM_REQUEST, data: id })
export const leaveRoom = (id) => ({ type: LEAVE_QUESTION_ROOM_REQUEST, data: id })
const socketPostQuestion = (data) => ({ type: POST_QUESTION_REQUEST, data: data})
const sendSocketFetchQuestion = (id) => ({ type: SOCKET_GET_QUESTION, data: id })

export const postQuestion = data => {
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
