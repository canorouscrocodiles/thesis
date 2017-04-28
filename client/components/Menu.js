import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loggingOut } from '../actions/auth'
import AskQuestion from './AskQuestion'
import Inbox from './Inbox'
import { Button, Dropdown, Icon, Image } from 'semantic-ui-react'

class OPMenu extends Component {
  constructor (props) {
    super(props)

    this.username = ''
    this.userId = ''

    if (this.props.user) {
      this.username = this.props.user.username
      this.userId = this.props.user.id
    }

    this.state = {
      options: [
        { key: 'profile', text: `${this.username}'s' Profile`, icon: 'user', value: 'profile' },
        { key: 'logout', text: 'Logout', icon: 'sign out', value: 'logout' }
      ]
    }

    this.trigger = (
      <span>
        <Image shape='circular' height='50em' width='50em' src={`http://graph.facebook.com/${this.userId}/picture?type=large`} />
      </span>
    )

    this.handleDropdownChange = this.handleDropdownChange.bind(this)
  }

  userProfileButton () {
    return (
      <div id='profileUser'>
        <Dropdown pointing='top right' trigger={this.trigger}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={this.handleDropdownChange} icon='user' text='My Profile' />
            <Dropdown.Item onClick={this.handleDropdownChange} icon='sign out' text='Logout' />
          </Dropdown.Menu>
        </Dropdown>
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

  handleDropdownChange (event, data) {
    console.log(data.text)
    if (data.text === 'My Profile') {
      console.log(this.props)
      this.props.history.push(`/users/${this.props.user.id}`)
    }

    if (data.text === 'Logout') {
      console.log(this.props)
      this.props.loggingOut()
      this.props.history.push('/')
    }
  }

  render () {
    return (
      <div id='menuWrapper'>
        <div id='menuTitle'>
          <Link className='link' to='/'><img src='/images/onPointLogo-Green-Blue.png' /></Link>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OPMenu))
