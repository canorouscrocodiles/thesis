import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loggingOut } from '../actions/auth'
import AskQuestion from './AskQuestion'
import Inbox from './Inbox'

class Menu extends Component {
  userProfileButton () {
    return (
      <li className='nav-link-right'>
        <Link className='link' to={`/users/${this.props.user.id}`}><img src={`http://graph.facebook.com/${this.props.user.id}/picture?type=square`} /></Link>
        <span>{this.props.user.username}</span>
        <Link className='link' onClick={this.props.loggingOut} to='/'>(Logout)</Link>
      </li>
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
          <Inbox />
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loggingOut: () => dispatch(loggingOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
