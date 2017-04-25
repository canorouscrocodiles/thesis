import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'
import cookie from 'react-cookie'
import { setUser } from '../actions/user'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import utils from '../utils'
import ErrorNotification from './ErrorNotification'
import GMap from './GMap'
import Menu from './Menu'
import QuestionPage from './QuestionPage'
import PostList from './PostList'
import UserProfile from './UserProfile'
import { sendLocationToServer } from '../actions/sockets/location'
import { getCategories, findAndJoin } from '../actions/sockets/questions'

const watchOptions = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }
    this.watchPosition = this.watchPosition.bind(this)
    this.watchLocationSuccess = this.watchLocationSuccess.bind(this)
    this.watchLocationError = this.watchLocationError.bind(this)
    this.renderQuestionPage = this.renderQuestionPage.bind(this)
    this.renderUserProfilePage = this.renderUserProfilePage.bind(this)
    this.displayError = this.displayError.bind(this)
  }

  componentWillMount () {
    this.watchPosition()
    this.removeLocationHash()
    this.setUserFromCookie()
    this.props.getCategories()
    this.props.findAndJoin(cookie.select(/(onpoint-id)/g)['onpoint-id'])
    Notification.requestPermission()
    //setTimeout(function () { this.displayError('You need to log in') }.bind(this), 2000)
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

  displayError (error) {
    this.setState({error: error})
    setTimeout(function () { this.setState({error: null}) }.bind(this), 3000)
  }

  setUserFromCookie () {
    let username = cookie.select(/(onpoint-username)/g)['onpoint-username']
    let id = cookie.select(/(onpoint-id)/g)['onpoint-id']
    if (username) {
      this.props.setUser({ username, id })
    }
  }

  renderQuestionPage (props) {
    const id = parseInt(props.match.params.id)
    const userQuestions = this.props.user.questions
    const questions = this.props.questions
    let question

    if (questions.length > 0 || userQuestions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].id === id) {
          question = questions[i]
          break
        }
      }
      if (question) {
        for (var i = 0; i < userQuestions.length; i++) {
          if (userQuestions[i].id === id) {
            question = userQuestions[i]
            break
          }
        }
      }
    } else {
      return <Redirect to='/' />
    }

    if (question) {
      return <QuestionPage {...props} id={id} question={question} />
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
        <ErrorNotification error={this.state.error} />
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
    getCategories: () => dispatch(getCategories()),
    findAndJoin: (id) => dispatch(findAndJoin(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
