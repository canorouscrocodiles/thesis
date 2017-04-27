import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUnread } from '../actions/sockets/answer'
import { removeQuestionFromInbox } from '../actions/inbox'
import { Menu, Icon, Label } from 'semantic-ui-react'

class Inbox extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.showMessages = this.showMessages.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    if (this.props.user.data) {
      this.props.getUnread(this.props.user.data.id)
    }
  }

  componentWillUpdate (nextProps) {
    if (nextProps.unreadExists && this.props.user.data) {
      this.props.getUnread(this.props.user.data.id)
    }
  }

  showMessages () {
    let list = document.getElementById('inboxList')
    if (list.style.display === 'none' || list.style.length < 1) {
      list.style.display = 'block'
    } else {
      list.style.display = 'none'
    }
  }

  handleClick (id) {
    this.showMessages()
    this.props.removeQuestionFromInbox(id)
    this.props.history.push(`/question/${id}`)
  }

  render () {
    return (
      <div id='profileInbox'>
        <div onClick={this.showMessages}>
          <Icon name='inbox' size='huge' color='blue' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    unread: state.answers.unread,
    unreadExists: state.answers.unreadExist
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUnread: (id) => dispatch(getUnread(id)),
    removeQuestionFromInbox: id => dispatch(removeQuestionFromInbox(id))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Inbox))
