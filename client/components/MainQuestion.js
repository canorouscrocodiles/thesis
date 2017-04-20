import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion } from '../actions/questions'
import { enterRoom, leaveRoom } from '../actions/sockets/questions'
import moment from 'moment'

class MainQuestion extends Component {
  componentWillMount () {
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

  render () {
    const { question } = this.props
    let humanTime = moment(question.timestamp).fromNow()
    if (!question) { return this.renderLoader() }
    return (
      <div>
        <h2>{question.message}</h2>
        <p>{question.username} - {question.location}</p>
        <p>{humanTime} - {question.category}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, question: state.questions.selectedQuestion }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
