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

export const fetchingLocationName = (location) => {
  return dispatch => {
    dispatch(fetchingLocation())
    if (window.google) {
      let geocoder = new window.google.maps.Geocoder()
      let latlng = new window.google.maps.LatLng(location.lat, location.lng)
      geocoder.geocode({'latLng': latlng}, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          dispatch(setLocation({location: location, name: results[0]}))
        } else {
          dispatch(fetchLocationError(status))
        }
      })
    } else {
      setTimeout(() => fetchingLocationName(location), 500)
    }
  }
}

export const fetchLocationError = (error) => {
  return {
    type: FETCH_LOCATION_ERROR,
    data: error
  }
}
