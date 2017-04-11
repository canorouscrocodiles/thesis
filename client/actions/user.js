import axios from 'axios'

const fetchingUser = (bool) => {
  return {
    type: 'FETCHING_USER',
    data: bool
  }
}

const setUser = (user) => {
  return {
    type: 'SET_USER',
    user
  }
}

const fetchUserError = (error) => {
  return {
    type: 'FETCH_USER_ERROR',
    error
  }
}

export const fetchUser = () => {
  return dispatch => {
    // dispatch action we're fetching user
    dispatch(fetchingUser(true))
    // fetch user from API
    axios.get('API ENDPOINT')
    .then(user => setUser(user))
    .catch(error => fetchUserError(error))
    // perform finally option
  }
}
