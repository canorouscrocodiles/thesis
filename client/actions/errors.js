export const SHOW_ERROR_NOTIFICATION = 'SHOW_ERROR_NOTIFICATION'
export const REMOVE_ERROR_NOTIFICATION = 'REMOVE_ERROR_NOTIFICATION'

export const showErrorNotification = (errorMessage, timeout = 5000) => {
  return dispatch => {
    dispatch({ type: SHOW_ERROR_NOTIFICATION, data: errorMessage })
    setTimeout(() => dispatch({ type: REMOVE_ERROR_NOTIFICATION }), timeout)
  }
}
