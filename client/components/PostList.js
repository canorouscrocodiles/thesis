import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchQuestions } from '../actions/questions'
import ListEntry from './ListEntry'

class PostList extends Component {
  componentWillMount () {
    this.props.fetchQuestions()
  }

  render () {
    return (
      <div>
        <h3>PostList</h3>
        {this.props.questions.data.map(question => <ListEntry question={question} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { questions: state.questions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestions: () => dispatch(fetchQuestions())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)
