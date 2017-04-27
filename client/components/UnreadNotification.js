import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { markQuestionsAsRead, sortQuestions } from '../actions/questions'

class UnreadNotification extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.setUnreadToFalse = this.setUnreadToFalse.bind(this)
  }

  setUnreadToFalse () {
    // debugger
    this.props.markQuestionsAsRead()
    this.props.sortQuestions('New', [])
  }

  componentWillUnmount () {
    this.props.markQuestionsAsRead()
    this.props.sortQuestions('New', [])
  }

  render () {
    return (
      <Segment raised onClick={this.setUnreadToFalse}>New questions!</Segment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    markQuestionsAsRead: () => dispatch(markQuestionsAsRead()),
    sortQuestions: (sortBy, categories) => dispatch(sortQuestions(sortBy, categories))
  }
}

export default connect(null, mapDispatchToProps)(UnreadNotification)
