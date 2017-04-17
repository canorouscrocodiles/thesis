import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchQuestionAnswers } from '../actions/answer'
import QAEntry from './QAEntry'
import AddAnswer from './AddAnswer'

class AnswerList extends Component {
  componentWillMount () {
    let id = this.props.id
    this.props.fetchQuestionAnswers(id)
  }

  render () {
    return (
      <div className="post-list">
        <h4>Answers</h4>
        <AddAnswer id={this.props.id}/>
        {this.props.answers.map(answer => <QAEntry key={answer.id} answer={answer} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { answers: state.answers.data }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestionAnswers: (id) => dispatch(fetchQuestionAnswers(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerList)
