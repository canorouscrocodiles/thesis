import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import updateVote from '../actions/sockets/votes'
import { socketUpdateAnswer } from '../actions/sockets/answer'

class QAEntry extends Component {
  constructor(props) {
    super(props)
  }

  renderVotingStyles(conditionalClassname, dependentOn, defaultClassName = 'button') {
    const { users_vote_count } = this.props
    if (users_vote_count === dependentOn) {
      return `${defaultClassName} ${conditionalClassname}`
    } else {
      return defaultClassName
    }
  }

  renderVoteButtons() {
    const { dispatch, updateVote } = this.props
    return (
      <div>
        <button className={this.renderVotingStyles('upvote', 1)} onClick={() => updateVote && dispatch(updateVote(1))}>Vote Up</button>
        <button className={this.renderVotingStyles('downvote', -1)} onClick={() => updateVote && dispatch(updateVote(-1))}>Vote Down</button>
      </div>
    )
  }

  render() {
    const humanTime = moment(this.props.answer.timestamp).fromNow()
    return (
      <div className='list-entry'>
        <p>{this.props.answer.vote_count}</p>
        {this.renderVoteButtons()}
        <div>
          <p>{this.props.answer.username}</p>
          <img src={this.props.answer.avatar} />
          <p className='post-title'>{this.props.answer.message}</p>
          <p>{humanTime}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = state.user.data && state.user.data.id ? state.user.data.id : null
  return { user_id: id, users_vote_count: ownProps.answer.users_vote_count }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    updateVote: stateProps.user_id ? (vote_type) => updateVote(ownProps.answer.id, ownProps.answer.question_id, stateProps.user_id, vote_type) : null,
    socketUpdateAnswer: stateProps.user_id === ownProps.answer.user_id ? (message) => socketUpdateAnswer({ id: ownProps.answer.id, question_id: ownProps.answer.question_id, message: message }) : null
  }
}

export default connect(mapStateToProps, null, mergeProps)(QAEntry)
