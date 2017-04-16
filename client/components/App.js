import React, { Component } from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import { fetchQuestions } from '../actions/questions'
import GMap from './GMap'
import CurrentLocation from './CurrentLocation'
import Menu from './Menu'
import PostList from './PostList'
import { testSocketPing } from '../actions/sockets/testPing'

class App extends Component {
  constructor (props) {
    super(props)
    this.props.testSocketPing()
  }

  componentWillMount () {
    this.getCurrentPosition()
    this.removeLocationHash()
    this.setTokenFromCookie()
  }

  getCurrentPosition () {
    navigator.geolocation.getCurrentPosition(coords => {
      this.props.fetchingLocationName({lat: coords.coords.latitude, lng: coords.coords.longitude})
      this.props.fetchQuestions({lat: coords.coords.latitude, lng: coords.coords.longitude})
    }, error => {
      this.props.fetchLocationError(error)
    })
  }

  // To remove FB security hash on auth redirect
  removeLocationHash () {
    if (window.location.hash) {
      window.location.hash = ''
    }
  }

  setTokenFromCookie () {
    // Grab token from cookie
    let token = cookie.select(/(onpoint-bearer)/g)['onpoint-bearer']

    // Set token in local storage if it exists
    if (token) {
      window.localStorage.onPointJWT = token
    }

    // Clear the cookie for the future
    cookie.remove('onpoint-bearer')
  }

  render () {
    return (
      <div>
        <h2>OnPoint 👇</h2>
        <Menu />
        <a href='/auth/facebook'>Login with Facebook</a>
        <GMap />
        <CurrentLocation />
        <PostList />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingLocationName: coords => dispatch(fetchingLocationName(coords)),
    fetchLocationError: error => dispatch(fetchLocationError(error)),
    testSocketPing: () => dispatch(testSocketPing()),
    fetchQuestions: location => dispatch(fetchQuestions(location))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
