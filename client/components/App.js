import React, { Component } from 'react'
import GMap from './GMap'
import { connect } from 'react-redux'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import CurrentLocation from './CurrentLocation'
import Menu from './Menu'
import PostList from './PostList'

class App extends Component {
  componentWillMount () {
    navigator.geolocation.getCurrentPosition(coords => {
      this.props.fetchingLocationName({lat: coords.coords.latitude, lng: coords.coords.longitude})
    }, error => {
      this.props.fetchLocationError(error)
    })
  }

  render () {
    return (
      <div>
        <h2>OnPoint 👇</h2>
        <Menu />
        <GMap />
        <CurrentLocation />
        <PostList />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingLocationName: coords => dispatch(fetchingLocationName(coords)),
    fetchLocationError: error => dispatch(fetchLocationError(error))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
