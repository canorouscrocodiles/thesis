import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import updateVote from '../actions/sockets/votes'
import { socketUpdateAnswer } from '../actions/sockets/answer'

class QAEntry extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: null,
      charCount: 300,
      editing: false
    }
    this.handleAnswerChange = this.handleAnswerChange.bind(this)
    this.updateAnswer = this.updateAnswer.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
  }

  handleAnswerChange (event) {
    let remaining = 300 - event.target.value.length
    this.setState({ message: event.target.value, charCount: remaining })
  }

  updateAnswer () {
    const { dispatch, socketUpdateAnswer } = this.props
    if (this.state.message !== null) {
      if (this.state.message.length < 1) {
        this.state.message = null
      } else {
        this.props.answer.message = this.state.message
        dispatch(socketUpdateAnswer(this.props.answer.message))
      }
    }
    this.setState({ editing: false })
  }

  cancelUpdate () {
    this.setState({ message: null, editing: false })
  }

  renderEditButton () {
    if (!this.props.user.data) { return null }
    const { id } = this.props.user.data
    const { user_id } = this.props.answer
    const { activeQuestion } = this.props
    if (id === user_id && activeQuestion) {
      return <button className='button' onClick={() => this.setState({editing: true})}>Edit</button>
    } else {
      return null
    }
  }

  renderVotingStyles (conditionalClassname, dependentOn, defaultClassName = 'button') {
    const { users_vote_count } = this.props
    if (users_vote_count === dependentOn) {
      return `${defaultClassName} ${conditionalClassname}`
    } else {
      return defaultClassName
    }
  }

  renderVoteButtons () {
    const { dispatch, updateVote, activeQuestion } = this.props
    if (!activeQuestion) return null
    return (
      <div>
        <button className={this.renderVotingStyles('upvote', 1)} onClick={() => updateVote && dispatch(updateVote(1))}>Vote Up</button>
        <button className={this.renderVotingStyles('downvote', -1)} onClick={() => updateVote && dispatch(updateVote(-1))}>Vote Down</button>
      </div>
    )
  }

  render () {
    const humanTime = moment(this.props.answer.timestamp).fromNow()
    if (!this.state.editing) {
      return (
        <div className='list-entry'>
          <p>{this.props.answer.vote_count}</p>
          {this.renderVoteButtons()}
          <div>
            <p>{this.props.answer.username}</p>
            <img src={this.props.answer.avatar} />
            <p className='post-title'>{this.state.message !== null ? this.state.message : this.props.answer.message}</p>
            {this.renderEditButton()}
            <p>{humanTime}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='list-entry'>
          <p>{this.props.answer.vote_count}</p>
          {this.renderVoteButtons()}
          <div>
            <p>{this.props.answer.username}</p>
            <img src={this.props.answer.avatar} />
            <textarea maxLength='300' cols='100' rows='4' value={this.state.message !== null ? this.state.message : this.props.answer.message} onChange={this.handleAnswerChange} name='answer' placeholder='Edit answer...' />
            <p>{`${this.state.charCount} characters remaining`}</p>
            <span className='button' onClick={this.updateAnswer}>Save</span>
            <span className='button' onClick={this.cancelUpdate}>Cancel</span>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = state.user.data && state.user.data.id ? state.user.data.id : null
  return { user: state.user, user_id: id, users_vote_count: ownProps.answer.users_vote_count }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    updateVote: stateProps.user_id ? (vote_type) => updateVote(ownProps.answer.id, ownProps.answer.question_id, stateProps.user_id, vote_type) : null,
    socketUpdateAnswer: (message) => socketUpdateAnswer({ id: ownProps.answer.id, question_id: ownProps.answer.question_id, message: message })
  }
}

export default connect(mapStateToProps, null, mergeProps)(QAEntry)
