import cookie from 'react-cookie'
export const POST_ANSWER = 'post/ANSWER_TO_QUESTION'
export const POST_ANSWER_SUCCESS = 'POST_ANSWER_SUCCESS'
export const POST_ANSWER_FAILED = 'POST_ANSWER_FAILED'

const sendQuestionAnswer = (answer) => ({ type: POST_ANSWER, data: answer })

export const postQuestionAnswer = (data) => {
  let token = cookie.select(/(onpoint-bearer)/g)['onpoint-bearer']
  Object.assign(data, {token})

  console.log(`Dispatching with token ${token}`)
  return dispatch => {
    dispatch(sendQuestionAnswer(data))
  }
}
