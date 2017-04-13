import { FETCHING_USER, SET_USER, FETCH_USER_ERROR } from '../actions/user'

const initialState = {user: null, fetching: false, error: null}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_USER:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case SET_USER:
      return {
        ...state,
        user: action.data,
        fetching: false
      }
    case FETCH_USER_ERROR:
      return {
        ...state,
        error: action.data,
        fetching: false
      }
    default:
      return state
  }
}
