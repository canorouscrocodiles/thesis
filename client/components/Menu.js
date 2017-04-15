import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loggingOut } from '../actions/auth'
import AskQuestion from './AskQuestion'

class Menu extends Component {
  userProfileButton () {
    return (
      <p>Welcome {this.props.user.username}! <a onClick={this.props.loggingOut}>(Logout)</a></p>
    )
  }

  loggedOutButton () {
    return (
      <p><a href='/auth/facebook'>Login with Facebook</a></p>
    )
  }

  render () {
    return (
      <div>
        <p>Home</p>
        <p>Search</p>
        <p>Notifications</p>
        { this.props.user ? this.userProfileButton() : this.loggedOutButton() }
        <AskQuestion />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user.user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loggingOut: () => dispatch(loggingOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
