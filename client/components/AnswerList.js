import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchQuestionAnswers } from '../actions/answer'
import QAEntry from './QAEntry'
import AddAnswer from './AddAnswer'

class AnswerList extends Component {
  componentWillMount () {
    const { id, user_id } = this.props
    this.props.fetchQuestionAnswers(id, user_id)
  }

  render () {
    return (
      <div className='post-list'>
        <h4>Answers</h4>
        <AddAnswer id={this.props.id} />
        {this.props.answers.map(answer => <QAEntry key={answer.id} answer={answer} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    answers: state.answers.data,
    user_id: state.user.data ? state.user.data.id : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestionAnswers: (id, user_id) => dispatch(fetchQuestionAnswers(id, user_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerList)
