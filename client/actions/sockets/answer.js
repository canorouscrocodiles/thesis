export const POST_ANSWER = 'post/ANSWER_TO_QUESTION'
export const POST_ANSWER_SUCCESS = 'POST_ANSWER_SUCCESS'
export const POST_ANSWER_FAILED = 'POST_ANSWER_FAILED'

const sendQuestionAnswer = (answer) => ({ type: POST_ANSWER, data: answer })

export const postQuestionAnswer = (data) => {
  return dispatch => {
    dispatch(sendQuestionAnswer(data))
  }
}
