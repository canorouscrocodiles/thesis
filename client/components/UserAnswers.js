import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserAnswerEntry from './UserAnswerEntry'
import { Feed } from 'semantic-ui-react'

class UserAnswers extends Component {
  render () {
    console.log('Props in UserQuestions ', this.props)
    let answers = this.props.user.answers

    if (answers) {
      return (
        <Feed>
          {answers.map(answer => <UserAnswerEntry key={answer.id} answer={answer} />)}
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

export default connect(mapStateToProps)(UserAnswers)
