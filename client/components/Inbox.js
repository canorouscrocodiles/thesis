import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUnread } from '../actions/sockets/answer'

class Inbox extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.showMessages = this.showMessages.bind(this)
  }

  componentWillMount () {
    if (this.props.user) {
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

  render () {
    return (
      <div>
        <img id='inboxImg' onClick={this.showMessages} src='/images/inbox.png' />
        <span id='inboxLabel' onClick={this.showMessages}>{this.props.unread[0] || ''}</span>
        <div id='inboxList'>
          {
            this.props.unread.map((entry, id) => {
              if (id > 0) {
                return (
                  <div key={entry.id}>
                    <p>{entry.question}</p>
                    {entry.answers.map((answer, id) => <p key={`${id}`}>{answer}</p>)}
                    <br />
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    unread: state.answers.unread
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUnread: (id) => dispatch(getUnread(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inbox)
