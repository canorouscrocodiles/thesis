import React, { Component } from 'react'
import { connect } from 'react-redux'
import { postQuestion } from '../actions/sockets/questions'

class AskQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      question: '',
      categories: ['Chipotle', 'Convention', 'Sports', 'Education', 'Advice', 'Traffic', 'Animals', 'Health', 'History', 'Tourism', 'Tech', 'Business', 'News', 'Food', 'Emergency', 'Music', 'Movies', 'TV', 'Life', 'Love', 'Politics'],
      category: '1'
    }
    this.handleQuestionChange = this.handleQuestionChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.submitQuestion = this.submitQuestion.bind(this)
    this.resetValues = this.resetValues.bind(this)
  }

  handleQuestionChange (event) {
    this.setState({ question: event.target.value })
  }

  handleCategoryChange (event) {
    this.setState({ category: event.target.value })
  }

  resetValues () {
    this.setState({ question: '', category: '1' })
  }

  submitQuestion () {
    let district, city

    // Parse location_name data
    if (this.props.location_name) {
      let location = this.props.location_name.address_components
      district = location[2].long_name
      city = location[3].long_name
    }

    // Form message data
    // For now, user_id is hardcoded. We will want to reference this.state.user.user in the future
    let data = {
      user_id: this.props.user.data.id,
      message: this.state.question,
      coordinates: this.props.location,
      location: `${district}, ${city}`,
      category_id: this.state.category
    }

    // Check to make sure we have all the necessary data points to successfully insert record
    if (data.user_id && data.message && data.coordinates.lat && data.coordinates.lng && data.location && data.category_id) {
      // If we have all the data
      this.props.postQuestion(data)
      this.resetValues()
    } else {
      console.log('Missing some info')
    }
  }

  render () {
    return (
      <li className="nav-link-right">
        <input type='text' size="100" value={this.state.question} onChange={this.handleQuestionChange} name='question' placeholder='Ask a question...' />
        <select value={this.state.category} onChange={this.handleCategoryChange}>
          {this.state.categories.map((category, id) => <option key={id} value={id + 1}>{category}</option>)}
        </select>
        <span className="button" onClick={this.submitQuestion}>Ask</span>
      </li>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, location: state.currentLocation.location, location_name: state.currentLocation.name }
}

const mapDispatchToProps = dispatch => {
  return {
    postQuestion: (data) => dispatch(postQuestion(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AskQuestion)
