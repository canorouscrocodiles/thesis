import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUnread } from '../actions/sockets/answer'
import { removeQuestionFromInbox } from '../actions/inbox'
import { Popup, Icon, Label } from 'semantic-ui-react'

class Inbox extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this)
    this.renderInboxList = this.renderInboxList.bind(this)
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

  handleClick (id) {
    this.props.removeQuestionFromInbox(id)
    this.props.history.push(`/question/${id}`)
  }

  renderInboxList (list) {
    return list.map((entry, id) => {
      if (id > 0 && id < list.length - 1) {
        return (
          <div className='inboxEntry' key={entry.id}>
            <p className='inboxQuestion' onClick={() => this.handleClick(entry.id)}>{entry.question}</p>
            {entry.answers.map((answer, id) => <div className='inboxAnswer' key={`${id}`}>{answer}</div>)}
            <hr />
          </div>
        )
      } else if (id > 0) {
        return (
          <div className='inboxEntry' key={entry.id}>
            <p className='inboxQuestion' onClick={() => this.handleClick(entry.id)}>{entry.question}</p>
            {entry.answers.map((answer, id) => <div className='inboxAnswer' key={`${id}`}>{answer}</div>)}
          </div>
        )
      }
    })
  }

  render () {
    if (this.props.unread[0] > 0) {
      return (
        <Popup
          trigger={
            <div id='profileInbox'>
              <div onClick={this.showMessages}>
                <Icon name='inbox' size='huge' />
                <Label id='inboxLabel' floating >{this.props.unread[0]}</Label>
              </div>
            </div>
          }
          flowing
          on='click'
        >
          <div id='inboxList'>
            {
              this.renderInboxList(this.props.unread)
            }
          </div>
        </Popup>
      )
    } else {
      return (
        <div id='profileInbox'>
          <div onClick={this.showMessages}>
            <Icon name='inbox' size='huge' id='inbox' />
          </div>
        </div>
      )
    }
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
