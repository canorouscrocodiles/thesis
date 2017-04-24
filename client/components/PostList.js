import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { sortQuestions, changeOption, changeValue } from '../actions/questions'
import ListEntry from './ListEntry'
import UnreadNotification from './UnreadNotification'

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: [],
      sortOptions: [ 'New', 'Trending', 'Distance', 'Old' ],
      option: 0
    }

    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentWillMount () {
    let index = this.props.sortOptions.findIndex(x => x === this.props.sortBy)
    this.props.changeOption(index)

    let value = this.props.categories.map(x => ({ label: x, value: x }))
    this.props.changeValue(value)
  }

  handleOptionChange (event) {
    this.props.changeOption(event.target.value)

    let selectedCategories = this.props.value.map(x => x.value)
    this.props.sortQuestions(this.props.sortOptions[event.target.value], selectedCategories)
  }

  handleSelectChange (value) {
    console.log('You\'ve selected:', value)
    this.props.changeValue(value)

    let selectedCategories = value.map(x => x.value)
    console.log('sortBy ', this.state.sortOptions[this.state.option])

    this.props.sortQuestions(this.props.sortOptions[this.props.option], selectedCategories)
  }

  locationLoaded () {
    let district
    let city
    let location = this.props.currentLocation.name.address_components
    if (location.length > 1) {
      district = location[2].long_name
      city = location[3].long_name
    } else {
      district = 'United States'
      city = 'The Earth'
    }
    return (
      <h3>Questions around { `${district}, ${city}` }</h3>
    )
  }

  renderMessage () {
    if (!this.props.currentLocation.name) return <h3>Finding your location...</h3>
    return this.locationLoaded()
  }

  renderUnread () {
    if (this.props.unread) {
      return <UnreadNotification />
    }
  }

  render () {
    return (
      <div>
        {this.renderMessage()}
        <select value={this.props.option} onChange={this.handleOptionChange}>
          {this.props.sortOptions.map((option, i) => <option key={i} value={i}>{option}</option>)}
        </select>
        <Select
          multi
          value={this.props.value}
          placeholder='Filter categories'
          options={this.props.categoryOptions}
          onChange={this.handleSelectChange}
        />
        {this.renderUnread()}
        <div className='post-list'>
          {this.props.questions.data.map(question => <ListEntry key={question.id} question={question} />)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
    currentLocation: state.currentLocation,
    sortBy: state.questions.sortBy,
    categories: state.questions.categories,
    categoryOptions: state.questions.categoryOptions,
    unread: state.questions.unread,
    value: state.questions.value,
    sortOptions: state.questions.sortOptions,
    option: state.questions.option
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sortQuestions: (sortBy, categories) => dispatch(sortQuestions(sortBy, categories)),
    changeOption: (option) => dispatch(changeOption(option)),
    changeValue: (value) => dispatch(changeValue(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)
