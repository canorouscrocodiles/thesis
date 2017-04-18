import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion } from '../actions/questions'
import { enterRoom, leaveRoom } from '../actions/sockets/questions'

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

  render () {
    const { question } = this.props
    if (!question) { return this.renderLoader() }
    return (
      <div>
        <h2>{question.message}</h2>
        <p>{question.username} - {question.location}</p>
        <p>{question.timestamp} - {question.category}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { question: state.questions.selectedQuestion }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
