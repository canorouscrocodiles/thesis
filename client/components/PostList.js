import React, { Component } from 'react'
import { connect } from 'react-redux'
import ListEntry from './ListEntry'

class PostList extends Component {
  render () {
    return (
      <div>
        <h3>PostList</h3>
        {this.props.questions.data.map(question => <ListEntry key={question.id} question={question} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { questions: state.questions }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)
