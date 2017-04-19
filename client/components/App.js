import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router'
import cookie from 'react-cookie'
import { setUser } from '../actions/user'
import { fetchingLocationName, fetchLocationError } from '../actions/location'
import { fetchQuestions } from '../actions/questions'
import GMap from './GMap'
import Menu from './Menu'
import QuestionPage from './QuestionPage'
import PostList from './PostList'
import { testSocketPing } from '../actions/sockets/testPing'
import { sendLocationToServer } from '../actions/sockets/location'

const watchOptions = {
  enableHighAccuracy: true,
  timeout: 60000,
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
    Notification.requestPermission()
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
        <Route exact path='/' component={PostList} />
        <Route path='/question/:id' render={(props) => {
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
        }} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    questions: state.questions.data
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
