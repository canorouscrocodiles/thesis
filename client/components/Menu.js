import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loggingOut } from '../actions/auth'
import AskQuestion from './AskQuestion'

class Menu extends Component {
  userProfileButton () {
    return (
      <li className='nav-link-right'><img src={`http://graph.facebook.com/${this.props.user.id}/picture?type=square`} />{this.props.user.username}<a onClick={this.props.loggingOut}>(Logout)</a></li>
    )
  }

  loggedOutButton () {
    return (
      <li className='nav-link-right'><a className='link button' href='/auth/facebook'>Login with Facebook</a></li>
    )
  }

  render () {
    return (
      <div id='menu'>
        <ul id='nav-links'>
          <li className='nav-link-left'><Link className='link' to='/'><h2 id='title'>OnPoint 👇</h2></Link></li>
          { this.props.user ? this.userProfileButton() : this.loggedOutButton() }
          <AskQuestion />
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user.data }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loggingOut: () => dispatch(loggingOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
