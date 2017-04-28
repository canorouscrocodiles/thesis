import React, { Component } from 'react'
import { connect } from 'react-redux'
import { postQuestionAnswer } from '../actions/sockets/answer'
import { showErrorNotification } from '../actions/errors'
import { Button, Input } from 'semantic-ui-react'

class AddAnswer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      answer: '',
      charCount: 300
    }
    this.handleAnswerChange = this.handleAnswerChange.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.resetValues = this.resetValues.bind(this)
  }

  handleAnswerChange (event) {
    let remaining = 300 - event.target.value.length
    this.setState({ answer: event.target.value, charCount: remaining })
  }

  resetValues () {
    this.setState({ answer: '', charCount: 300 })
  }

  submitAnswer () {
    if (!this.props.user) {
      console.log('User must be logged in to post an answer')
      return
    }
    let data = {
      user_id: this.props.user.id,
      message: this.state.answer,
      question_id: this.props.id
    }

    // Check to make sure we have all the necessary data points to successfully insert record
    if (data.user_id && data.message && data.question_id) {
      // If we have all the data call action
      this.props.postQuestionAnswer(data)
      this.resetValues()
    } else {
      console.log('Missing some info')
    }
  }

  renderSubmitButton () {
    const { user } = this.props
    let submitFunction
    if (user) {
      submitFunction = this.submitAnswer
    } else {
      submitFunction = this.props.showErrorNotification.bind(null, 'You must be logged in to answer a question')
    }
    return <Button onClick={submitFunction}>Respond</Button>
  }

  render () {
    const { activeQuestion } = this.props
    if (!activeQuestion) return null
    return (
      <div>
        <Input
          fluid
          value={this.state.answer}
          maxLength='300'
          onChange={this.handleAnswerChange}
          name='answer'
          label={{ basic: true, content: `${this.state.charCount}` }}
          labelPosition='right'
          placeholder='Provide an answer to this question'
        />
        {this.renderSubmitButton()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user.data }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postQuestionAnswer: (data) => dispatch(postQuestionAnswer(data)),
    showErrorNotification: (msg) => dispatch(showErrorNotification(msg))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAnswer)
