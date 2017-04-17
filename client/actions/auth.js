// import axios from 'axios'
import cookie from 'react-cookie'
import { SET_USER } from './user'

export const AUTHORIZING = 'AUTHORIZING'
export const SUCCESSFULLY_AUTHORIZED = 'AUTHORIZED'
export const LOGGING_OUT = 'LOGGING_OUT'
export const SUCCESSFULLY_LOGGED_OUT = 'LOGGED_OUT'
export const LOGGING_OUT_ERROR = 'LOGGING_OUT_ERROR'

const signalLoggingOut = () => ({ type: LOGGING_OUT })
const signalSuccessfulLogout = () => ({ type: SUCCESSFULLY_LOGGED_OUT })
const resetUserInformation = () => ({ type: SET_USER })
// const signalLoggingOutError = (error) => ({ type: LOGGING_OUT_ERROR, data: error })

export const loggingOut = () => {
  return dispatch => {
    dispatch(signalLoggingOut())

    // Clear user cookie and JWT from browser
    cookie.remove('onpoint-bearer', { path: '/' })
    cookie.remove('onpoint-username', { path: '/' })

    // Clear user information in state
    dispatch(resetUserInformation(null))
    dispatch(signalSuccessfulLogout())

    // TODO: Create logout route to invalidate JWT
    // axios.post('/auth/logout')
    //   .then(data => {
    //     console.log(data)
    //     dispatch(signalSuccessfulLogout())
    //   })
    //   .catch(error => dispatch(signalLoggingOutError(error)))
  }
}
