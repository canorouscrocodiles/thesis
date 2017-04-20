const SOCKET_VOTE_UPDATE = 'put/vote'
const UPDATING_VOTE = 'UPDATING_VOTE'
export const UPDATE_USER_VOTE = 'UPDATE_USER_VOTE'

export default (answer_id, question_id, user_id, vote_type) => {
  return dispatch => {
    dispatch({ type: UPDATING_VOTE })
    dispatch({ type: UPDATE_USER_VOTE, data: { vote_type, answer_id } })
    dispatch({
      type: SOCKET_VOTE_UPDATE,
      data: { answer_id, question_id, user_id, vote_type }
    })
  }
}
