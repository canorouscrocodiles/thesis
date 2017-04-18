import React, { Component } from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { setUser } from '../actions/user'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import { fetchQuestions } from '../actions/questions'
import GMap from './GMap'
import Menu from './Menu'
import PostList from './PostList'
import { testSocketPing } from '../actions/sockets/testPing'
import { sendLocationToServer } from '../actions/sockets/location'

const watchOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 0
}

class App extends Component {
  constructor (props) {
    super(props)
    this.props.testSocketPing()
    this.watchPosition = this.watchPosition.bind(this)
    this.watchLocationSuccess = this.watchLocationSuccess.bind(this)
    this.watchLocationError = this.watchLocationError.bind(this)
  }

  componentWillMount () {
    this.watchPosition()
    this.removeLocationHash()
    this.setUserFromCookie()
  }

  watchPosition () {
    navigator.geolocation.watchPosition(this.watchLocationSuccess, this.watchLocationError, watchOptions)
  }

  watchLocationError (error) {
    this.props.fetchLocationError(error)
  }

  watchLocationSuccess (coords) {
    this.props.sendLocationToServer({lat: coords.coords.latitude, lng: coords.coords.longitude})
    this.props.fetchingLocationName({lat: coords.coords.latitude, lng: coords.coords.longitude})
    this.props.fetchQuestions({lat: coords.coords.latitude, lng: coords.coords.longitude})
  }

  // To remove FB security hash on auth redirect
  removeLocationHash () {
    if (window.location.hash) {
      window.location.hash = ''
    }
  }

  setUserFromCookie () {
    let username = cookie.select(/(onpoint-username)/g)['onpoint-username']
    let id = cookie.select(/(onpoint-id)/g)['onpoint-id']
    if (username) {
      this.props.setUser({ username, id })
    }
  }

  render () {
    return (
      <div>
        <Menu username={this.props.user.username} />
        <GMap />
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
    setUser: user => dispatch(setUser(user)),
    fetchingLocationName: coords => dispatch(fetchingLocationName(coords)),
    fetchLocationError: error => dispatch(fetchLocationError(error)),
    testSocketPing: () => dispatch(testSocketPing()),
    fetchQuestions: location => dispatch(fetchQuestions(location)),
    sendLocationToServer: (coords) => dispatch(sendLocationToServer(coords))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
