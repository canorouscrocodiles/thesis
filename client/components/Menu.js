import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loggingOut } from '../actions/auth'
import AskQuestion from './AskQuestion'
import Inbox from './Inbox'
import { Button, Dropdown, Menu, Icon, Image } from 'semantic-ui-react'

class Menu2 extends Component {
  userProfileButton () {
    return (
      <div>
        <Link className='link' to={`/users/${this.props.user.id}`}>
          <Image shape='circular' height='40' width='40' src={`http://graph.facebook.com/${this.props.user.id}/picture?type=large`} />
          <span>{this.props.user.username}</span>
        </Link>
        <Link className='link' onClick={this.props.loggingOut} to='/'>(Logout)</Link>
      </div>
    )
  }

  loggedOutButton () {
    return (
      <Button color='facebook'>
        <Icon name='facebook' />Login With Facebook
      </Button>
    )
  }

  render () {
    return (
      <Menu fluid borderless>
        <Menu.Item position='left'>
          <Link className='link' to='/'><h1>On Point 👇</h1></Link>
        </Menu.Item>
        <Menu.Item position='center'>
          <AskQuestion />
        </Menu.Item>
        <Menu.Item position='right'>
          { this.props.user ? this.userProfileButton() : this.loggedOutButton() }
        </Menu.Item>
      </Menu>
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

export default connect(mapStateToProps, mapDispatchToProps)(Menu2)
