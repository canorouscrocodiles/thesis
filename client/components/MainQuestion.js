import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion, deactivateQuestion } from '../actions/questions'
import { enterRoom, leaveRoom, socketUpdateQuestion } from '../actions/sockets/questions'
import moment from 'moment'

class MainQuestion extends Component {
  componentWillMount () {
    console.log('Q PROPS', this.props)

    let enterInfo = {
      user_id: this.props.user.data.id,
      question_id: this.props.id,
      question_creator: this.props.user.data.id === this.props.question.user_id
    }
    this.props.enterRoom(enterInfo)
    this.props.selectSingleQuestion(this.props.id)
  }

  componentWillUnmount () {
    let leaveInfo = {
      user_id: this.props.user.data.id,
      question_id: this.props.id,
      question_creator: this.props.user.data.id === this.props.question.user_id
    }
    this.props.leaveRoom(leaveInfo)
  }

  renderLoader () {
    return (<div>Loading...</div>)
  }

  renderCloseButton () {
    const { currentUserId, question } = this.props
    const { user_id } = question
    if (currentUserId === user_id) {
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
    user: state.user,
    question: state.questions.selectedQuestion,
    currentUserId: state.user.data ? state.user.data.id : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id)),
    deactivateQuestion: (id) => dispatch(deactivateQuestion(id)),
    socketUpdateQuestion: data => dispatch(socketUpdateQuestion(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
