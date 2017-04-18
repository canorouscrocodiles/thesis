import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortQuestions } from '../actions/questions'

class SortQuestionsBar extends Component {
  constructor () {
    super()
    this.state = {
      sortingOptions: ['New', 'Hot', 'Distance', 'Old'],
      sortBy: '0'
    }

    this.handleSortChange = this.handleSortChange.bind(this)
  }

  handleSortChange (event) {
    console.log(event.target.value, this.state)
    this.setState({ sortBy: event.target.value })
    this.props.sortQuestions(this.state.sortingOptions[event.target.value])
  }

  render () {
    return (
      <div>Sort By:
      <select value={this.state.sortBy} onChange={this.handleSortChange}>
        {this.state.sortingOptions.map((sortType, id) => <option key={id} value={id}>{sortType}</option>)}
      </select>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
    currentLocation: state.currentLocation.location
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sortQuestions: (method) => dispatch(sortQuestions(method))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SortQuestionsBar)
