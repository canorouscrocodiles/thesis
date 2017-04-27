import React, { Component } from 'react'
import { connect } from 'react-redux'
import QAEntry from './QAEntry'
import { fetchQuestionAnswers } from '../actions/answer'

class AnswerList extends Component {
  componentWillMount () {
    const { id, user_id } = this.props
    this.props.fetchQuestionAnswers(id, user_id)
  }

  render () {
    const { question } = this.props
    return (
      <div className='post-list'>
        {this.props.answers.map(answer => <QAEntry key={answer.id} answer={answer} activeQuestion={question.active} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user.data ? state.user.data.id : null,
    answers: state.answers.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestionAnswers: (id, user_id) => dispatch(fetchQuestionAnswers(id, user_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerList)
