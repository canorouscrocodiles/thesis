import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserQuestionEntry from './UserQuestionEntry'
import { Feed } from 'semantic-ui-react'

class UserQuestions extends Component {
  render () {
    console.log('Props in UserQuestions ', this.props)
    let questions = this.props.user.questions

    if (questions) {
      return (
        <Feed>
          {questions.map(question => <UserQuestionEntry key={question.id} question={question} />)}
        </Feed>
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
