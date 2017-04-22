import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortQuestions } from '../actions/questions'
import ListEntry from './ListEntry'
import Select from 'react-select'

// const options = [ { label: 'Advice', value: 'advice' },
//   { label: 'Animals', value: 'animals' },
//   { label: 'Business', value: 'business' },
//   { label: 'Chipotle', value: 'chipotle' },
//   { label: 'Convention', value: 'convention' },
//   { label: 'Education', value: 'education' },
//   { label: 'Emergency', value: 'emergency' },
//   { label: 'Food', value: 'food' },
//   { label: 'Health', value: 'health' },
//   { label: 'History', value: 'history' },
//   { label: 'Life', value: 'life' },
//   { label: 'Love', value: 'love' },
//   { label: 'Movies', value: 'movies' },
//   { label: 'Music', value: 'music' },
//   { label: 'News', value: 'news' },
//   { label: 'Politics', value: 'politics' },
//   { label: 'Sports', value: 'sports' },
//   { label: 'TV', value: 'tv' },
//   { label: 'Tech', value: 'tech' },
//   { label: 'Tourism', value: 'tourism' },
//   { label: 'Traffic', value: 'traffic' }
// ]

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
    let index = this.state.sortOptions.findIndex(x => x === this.props.sortBy)
    this.setState({ option: index })

    let value = this.props.categories.map(x => ({ label: x, value: x }))
    this.setState({ value })
  }

  handleOptionChange (event) {
    this.setState({ option: event.target.value })
    let selectedCategories = this.state.value.map(x => x.value)
    this.props.sortQuestions(this.state.sortOptions[event.target.value], selectedCategories)
  }

  handleSelectChange (value) {
    console.log('You\'ve selected:', value)
    this.setState({ value })
    let selectedCategories = value.map(x => x.value)
    console.log('sortBy ', this.state.sortOptions[this.state.option])
    this.props.sortQuestions(this.state.sortOptions[this.state.option], selectedCategories)
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

  render () {
    return (
      <div>
        {this.renderMessage()}
        <select value={this.state.option} onChange={this.handleOptionChange}>
          {this.state.sortOptions.map((option, i) => <option key={i} value={i}>{option}</option>)}
        </select>
        <Select
          multi
          value={this.state.value}
          placeholder='Filter categories'
          options={this.props.categoryOptions}
          onChange={this.handleSelectChange}
        />
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
    categoryOptions: state.questions.categoryOptions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sortQuestions: (sortBy, categories) => dispatch(sortQuestions(sortBy, categories))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)
