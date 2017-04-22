import React, { Component } from 'react'
import { connect } from 'react-redux'
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

  render () {
    return (
      <div onClick={this.setUnreadToFalse}>There are new questions!</div>
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
