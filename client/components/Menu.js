import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loggingOut } from '../actions/auth'
import AskQuestion from './AskQuestion'
import Inbox from './Inbox'
import { Grid, Button, Label, Dropdown, Menu, Icon, Image } from 'semantic-ui-react'

class OPMenu extends Component {
  userProfileButton () {
    return (
      <div id='profileUser'>
        <Link className='link' to={`/users/${this.props.user.id}`}>
          <Image shape='circular' height='40em' width='40em' src={`http://graph.facebook.com/${this.props.user.id}/picture?type=large`} />
          <span>{this.props.user.username}</span>
        </Link>
        <Link className='link' onClick={this.props.loggingOut} to='/'>(Logout)</Link>
      </div>
    )
  }

  loggedOutButton () {
    return (
      <div id='profileUser'>
        <a href='/auth/facebook'>
          <Button id='logInButton' color='facebook'>
            <Icon name='facebook' />Login
          </Button>
        </a>
      </div>
    )
  }

  render () {
    return (
      <div id='menuWrapper'>
        <div id='menuTitle'>
          <Link className='link' to='/'><h1>On Point 👇</h1></Link>
        </div>
        <div id='menuQuestion'>
          <AskQuestion />
        </div>
        <div id='menuProfile'>
          <div id='menuProfileWrapper'>
            <Inbox />
            { this.props.user ? this.userProfileButton() : this.loggedOutButton() }
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OPMenu)
