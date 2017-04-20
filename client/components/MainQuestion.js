import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion, deactivateQuestion } from '../actions/questions'
import { enterRoom, leaveRoom } from '../actions/sockets/questions'
import moment from 'moment'

class MainQuestion extends Component {
  componentWillMount () {
    let id = this.props.id
    this.props.enterRoom(id)
    this.props.selectSingleQuestion(id)
  }

  componentWillUnmount () {
    this.props.leaveRoom(this.props.id)
  }

  renderLoader () {
    return (<div>Loading...</div>)
  }

  renderCloseButton() {
    const { currentUserId, question } = this.props
    const { user_id } = question
    if ( currentUserId === user_id) {
      return <button className='button' onClick={() => this.props.deactivateQuestion(question.id)}>Close question</button>
    } else {
      return null
    }
  }

  render () {
    const { question } = this.props
    let humanTime = moment(question.timestamp).fromNow()
    if (!question) { return this.renderLoader() }
    return (
      <div>
        <h2>{question.message}</h2>
        <p>{question.username} - {question.location}</p>
        <p>{humanTime} - {question.category}</p>
        {this.renderCloseButton()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    question: state.questions.selectedQuestion,
    currentUserId: state.user.data ? state.user.data.id : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id)),
    deactivateQuestion: (id) => dispatch(deactivateQuestion(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
