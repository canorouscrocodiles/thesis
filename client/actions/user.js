import axios from 'axios'

export const FETCHING_USER = 'FETCHING_USER'
export const FETCHING_USER_DONE = 'FETCHING_USER_DONE'
export const SET_USER = 'SET_USER'
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR'

const fetchingUser = () => {
  return {
    type: FETCHING_USER
  }
}

export const setUser = (user) => {
  return {
    type: SET_USER,
    data: user
  }
}

const fetchUserError = (error) => {
  return {
    type: FETCH_USER_ERROR,
    data: error
  }
}

export const fetchUser = (id) => {
  return dispatch => {
    // dispatch action we're fetching user
    dispatch(fetchingUser())
    // fetch user from API
    axios.get(`/api/users/${id}`)
    .then(user => dispatch(setUser(user)))
    .catch(error => {
      dispatch(fetchUserError(error))
    })
  }
}
