import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion, fetchSingleQuestion } from '../actions/questions'

class MainQuestion extends Component {
  componentWillMount () {
    let id = this.props.id
    if (Object.keys(this.props.question).length === 0) {
      this.props.fetchSingleQuestion(id)
    } else {
      this.props.selectSingleQuestion(id)
    }
  }

  renderLoader () {
    return (<div>Loading...</div>)
  }

  render () {
    const { question } = this.props
    if (!question) { return this.renderLoader() }
    return (
      <div>
        <p>{question.message}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { question: state.questions.selectedQuestion }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    fetchSingleQuestion: (id) => dispatch(fetchSingleQuestion(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
