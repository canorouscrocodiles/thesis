export const FETCHING_LOCATION = 'FETCHING_LOCATION'
export const SET_LOCATION = 'SET_LOCATION'
export const FETCH_LOCATION_ERROR = 'FETCH_LOCATION_ERROR'

export const fetchingLocation = () => {
  return {
    type: FETCHING_LOCATION
  }
}

export const setLocation = (location) => {
  return {
    type: SET_LOCATION,
    data: location
  }
}

export const fetchLocationError = (error) => {
  return {
    type: FETCH_LOCATION_ERROR,
    data: error
  }
}
