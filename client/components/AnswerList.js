import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchQuestionAnswers, sortAnswers } from '../actions/answer'
import QAEntry from './QAEntry'
import AddAnswer from './AddAnswer'

class AnswerList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: [],
      sortOptions: [ 'New', 'Trending', 'Old' ],
      option: 0
    }

    this.handleOptionChange = this.handleOptionChange.bind(this)
  }

  handleOptionChange (event) {
    this.setState({ option: event.target.value })
    this.props.sortAnswers(this.state.sortOptions[event.target.value])
  }

  componentWillMount () {
    const { id, user_id } = this.props
    this.props.fetchQuestionAnswers(id, user_id)

    let index = this.state.sortOptions.findIndex(x => x === this.props.sortBy)
    this.setState({ option: index })
  }

  componentWillReceiveProps (nextProps) {
    console.log('Component Updated ', nextProps)
    debugger
    if (nextProps.answers.length !== this.props.answers.length) {
      this.props.sortAnswers(this.state.sortOptions[this.state.option])
    }
  }

  selectQuestion () {
    let { question, userQuestion } = this.props
    if (!question) {
      question = userQuestion
    }
    return question
  }

  render () {
    const question = this.selectQuestion()
    return (
      <div className='post-list'>
        <h4>Answers</h4>
        <AddAnswer id={this.props.id} activeQuestion={question.active} />
        <select value={this.state.option} onChange={this.handleOptionChange}>
          {this.state.sortOptions.map((option, i) => <option key={i} value={i}>{option}</option>)}
        </select>
        {this.props.answers.map(answer => <QAEntry key={answer.id} answer={answer} activeQuestion={question.active} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    answers: state.answers.data,
    sortBy: state.answers.sortBy,
    userQuestion: state.user.selectedQuestion,
    question: state.questions.selectedQuestion,
    user_id: state.user.data ? state.user.data.id : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestionAnswers: (id, user_id) => dispatch(fetchQuestionAnswers(id, user_id)),
    sortAnswers: (sortBy) => dispatch(sortAnswers(sortBy))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerList)
