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

class App extends Component {
  constructor (props) {
    super(props)
    this.props.testSocketPing()
  }

  componentWillMount () {
    this.getCurrentPosition()
    this.removeLocationHash()
    this.setUsernameFromCookie()
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

  setUsernameFromCookie () {
    let username = cookie.select(/(onpoint-username)/g)['onpoint-username']
    console.log('User :', username)
    if (username) {
      this.props.setUser({ username })
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
    fetchQuestions: location => dispatch(fetchQuestions(location))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
