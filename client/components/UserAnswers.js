import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserAnswerEntry from './UserAnswerEntry'

class UserAnswers extends Component {
  render () {
    console.log('Props in UserQuestions ', this.props)
    let answers = this.props.user.answers

    if (answers) {
      return (
        <div className='post-list'>
          {answers.map(answer => <UserAnswerEntry key={answer.id} answer={answer} />)}
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

export default connect(mapStateToProps)(UserAnswers)
