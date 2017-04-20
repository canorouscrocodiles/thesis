import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'
import cookie from 'react-cookie'
import { setUser } from '../actions/user'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import { fetchQuestions } from '../actions/questions'
import GMap from './GMap'
import Menu from './Menu'
import QuestionPage from './QuestionPage'
import PostList from './PostList'
import UserProfile from './UserProfile'
import { testSocketPing } from '../actions/sockets/testPing'
import { sendLocationToServer } from '../actions/sockets/location'

const watchOptions = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 10000
}

class App extends Component {
  constructor (props) {
    super(props)
    this.props.testSocketPing()
    this.watchPosition = this.watchPosition.bind(this)
    this.watchLocationSuccess = this.watchLocationSuccess.bind(this)
    this.watchLocationError = this.watchLocationError.bind(this)
    this.renderQuestionPage = this.renderQuestionPage.bind(this)
    this.renderUserProfilePage = this.renderUserProfilePage.bind(this)
  }

  componentWillMount () {
    this.watchPosition()
    this.removeLocationHash()
    this.setUserFromCookie()
    Notification.requestPermission()
  }

  watchPosition () {
    navigator.geolocation.watchPosition(this.watchLocationSuccess, this.watchLocationError, watchOptions)
  }

  watchLocationError (error) {
    this.props.fetchLocationError(error)
  }

  watchLocationSuccess (coords) {
    // Get distance moved from current location.
    // If not more than 1/16 mi then do not update questions
    if (this.props.currentLocation.location) {
      let distance = this.getDistanceMoved(
        coords.coords.latitude,
        coords.coords.longitude,
        this.props.currentLocation.location.lat,
        this.props.currentLocation.location.lng
        )

      if (distance >= 0.1) {
        this.updateLocation(coords)
      }
    } else {
      this.updateLocation(coords)
    }
  }

  updateLocation (coords) {
    this.props.sendLocationToServer({lat: coords.coords.latitude, lng: coords.coords.longitude})
    this.props.fetchingLocationName({lat: coords.coords.latitude, lng: coords.coords.longitude})
    this.props.fetchQuestions({lat: coords.coords.latitude, lng: coords.coords.longitude})
  }

  getDistanceMoved (lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km

    return d
  }

  deg2rad (deg) {
    return deg * (Math.PI / 180)
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

  renderQuestionPage (props) {
    // Parse id from string to int
    let id = parseInt(props.match.params.id)

    // Get list of questions for user
    let questions = this.props.questions
    let allowedQuestion = false

    // Iterate through question ids
    if (questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        // If question with matching id is found
        if (questions[i].id === id) {
          // Set allowedQuestion to true and break out of loop
          allowedQuestion = true
          break
        }
      }
    } else {
      return <Redirect to='/' />
    }

    if (allowedQuestion) {
      return <QuestionPage {...props} />
    } else {
      return <Redirect to='/' />
    }
  }

  renderUserProfilePage (props) {
    let id = parseInt(props.match.params.id)

    if (this.props.user.data && id === parseInt(this.props.user.data.id)) {
      return <UserProfile {...props} />
    } else {
      console.log('You cannot view this profile.')
      return <Redirect to='/' />
    }
  }

  render () {
    return (
      <div>
        <Menu username={this.props.user.username} />
        <GMap />
        <Route exact path='/' component={PostList} />
        <Route path='/users/:id' render={this.renderUserProfilePage} />
        <Route path='/question/:id' render={this.renderQuestionPage} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    questions: state.questions.data,
    currentLocation: state.currentLocation
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
