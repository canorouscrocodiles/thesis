import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserQuestionEntry from './UserQuestionEntry'

class UserQuestions extends Component {
  render () {
    console.log('Props in UserQuestions ', this.props)
    let questions = this.props.user.questions

    if (questions) {
      return (
        <div>
          {questions.map(question => <UserQuestionEntry key={question.id} question={question} />)}
        </div>
      )
    } else {
      return (<div>LOADING...</div>)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(UserQuestions)
