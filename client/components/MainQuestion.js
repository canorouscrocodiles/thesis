import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion } from '../actions/questions'

class MainQuestion extends Component {
  componentWillMount () {
    let id = this.props.match.params.id
    this.props.selectSingleQuestion(id)
  }

  render () {
    return (
      <div>
        <p>{this.props.question.message}</p>
        <p>Why</p>
        <p>Wtf</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { question: state.questions.selectedQuestion }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
