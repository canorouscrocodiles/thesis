const SEND_LOCATION = 'post/location'
const UPDATING_LOCATION = 'UPDATING_LOCATION'
export const UPDATED_QUESTIONS_SUCCESS = 'UPDATED_QUESTIONS_SUCCESS'
export const UPDATED_QUESTIONS_FAILURE = 'UPDATED_QUESTIONS_FAILURE'

const sendLocation = (coords) => {
  return {
    type: SEND_LOCATION,
    data: coords
  }
}

const updatingLocation = () => ({ type: UPDATING_LOCATION })

export const sendLocationToServer = (coords) => {
  return dispatch => {
    dispatch(updatingLocation())
    dispatch(sendLocation(coords))
  }
}
