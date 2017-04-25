import axios from 'axios'

export const FETCHING_USER = 'FETCHING_USER'
export const FETCHING_USER_DONE = 'FETCHING_USER_DONE'
export const SET_USER = 'SET_USER'
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR'
export const SET_USER_QUESTIONS = 'SET_USER_QUESTIONS'
export const SET_USER_ANSWERS = 'SET_USER_ANSWERS'

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

export const setUserQuestions = (questions) => {
  return {
    type: SET_USER_QUESTIONS,
    data: questions
  }
}

export const setUserAnswers = (answers) => {
  return {
    type: SET_USER_ANSWERS,
    data: answers
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
    .then(user => dispatch(setUser(user.data)))
    .catch(error => {
      dispatch(fetchUserError(error))
    })
  }
}

export const fetchUserQuestions = (id) => {
  return dispatch => {
    axios.get(`/api/users/${id}/questions`)
    .then(questions => dispatch(setUserQuestions(questions.data)))
    .catch(error => {
      dispatch(fetchUserError(error))
    })
  }
}

export const fetchUserAnswers = (id) => {
  return dispatch => {
    axios.get(`/api/users/${id}/answers`)
    .then(answers => dispatch(setUserAnswers(answers.data)))
    .catch(error => {
      dispatch(fetchUserError(error))
    })
  }
}
