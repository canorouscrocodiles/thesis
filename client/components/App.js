import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'
import cookie from 'react-cookie'
import { setUser } from '../actions/user'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import utils from '../utils'
import GMap from './GMap'
import Menu from './Menu'
import QuestionPage from './QuestionPage'
import PostList from './PostList'
import UserProfile from './UserProfile'
import { sendLocationToServer } from '../actions/sockets/location'
import { getCategories } from '../actions/sockets/questions'

const watchOptions = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
}

class App extends Component {
  constructor (props) {
    super(props)
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
    this.props.getCategories()
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
    // If not more than 1/16 mi (~100m) then do not update questions
    if (this.props.currentLocation.location) {
      let distance = utils.haversine(
        coords.coords.latitude,
        coords.coords.longitude,
        this.props.currentLocation.location.lat,
        this.props.currentLocation.location.lng
        ) * 1000

      if (distance >= 100) {
        this.updateLocation(coords)
      }
    } else {
      this.updateLocation(coords)
    }
  }

  updateLocation (coords) {
    const user_id = this.props.user.data ? this.props.user.data.id : null
    this.props.sendLocationToServer({user_id: user_id, coordinates: {lat: coords.coords.latitude, lng: coords.coords.longitude}})
    this.props.fetchingLocationName({lat: coords.coords.latitude, lng: coords.coords.longitude})
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
    const userQuestions = this.props.user.questions
    // Get list of questions for user
    let questions = this.props.questions
    let allowedQuestion = false
    let from

    // Iterate through question ids
    if (questions.length > 0 || userQuestions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        // If question with matching id is found
        if (questions[i].id === id) {
          // Set allowedQuestion to true and break out of loop
          allowedQuestion = true
          from = 'home'
          break
        }
      }
      for (var i = 0; i < userQuestions.length; i++) {
        if (userQuestions[i].id === id) {
          allowedQuestion = true
          from = 'profile'
          break
        }
      }
    } else {
      return <Redirect to='/' />
    }

    if (allowedQuestion) {
      return <QuestionPage {...props} from={from} />
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
    sendLocationToServer: (data) => dispatch(sendLocationToServer(data)),
    getCategories: () => dispatch(getCategories())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
