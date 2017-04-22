import cookie from 'react-cookie'
export const POST_ANSWER = 'post/ANSWER_TO_QUESTION'
export const POST_ANSWER_SUCCESS = 'POST_ANSWER_SUCCESS'
export const POST_ANSWER_FAILED = 'POST_ANSWER_FAILED'
const UPDATE_ANSWER_REQUEST = 'UPDATE_ANSWER_REQUEST'
const SEND_UPDATE_ANSWER = 'put/answer'
const GET_UNREAD_ANSWERS = 'get/unread'

const sendQuestionAnswer = (answer) => ({ type: POST_ANSWER, data: answer })

export const postQuestionAnswer = (data) => {
  let token = cookie.select(/(onpoint-bearer)/g)['onpoint-bearer']
  Object.assign(data, {token})

  console.log(`Dispatching with token ${token}`)
  return dispatch => {
    dispatch(sendQuestionAnswer(data))
  }
}

export const socketUpdateAnswer = data => {
  return dispatch => {
    dispatch({ type: UPDATE_ANSWER_REQUEST })
    dispatch({ type: SEND_UPDATE_ANSWER, data: data })
  }
}

export const getUnread = data => {
  return dispatch => {
    dispatch({ type: GET_UNREAD_ANSWERS, data: data })
  }
}
