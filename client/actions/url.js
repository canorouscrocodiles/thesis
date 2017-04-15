export const URL_RESET = 'URL_RESET'
export const SET_URL = 'SET_URL'
const URL_REDIRECT = 'URL_REDIRECT'

const reset = () => ({ type: URL_RESET })

export const redirectAction = () => ({ type: URL_REDIRECT })

// TODO: set to url to action and reducer
export const signalRedirect = () => {
  return dispatch => {
    return new Promise((res, rej) => {
      dispatch(redirectAction())
      res()
    })
  }
}

export const redirectTo = (historyObj, url) => {
  return new Promise ((res, rej) => {
    historyObj.push(url)
    res()
  })
}

export const resetURLState = () => {
  return dispatch => {
    dispatch(reset())
  }
}
