import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Input } from 'semantic-ui-react'
import { postQuestion } from '../actions/sockets/questions'
import { showErrorNotification } from '../actions/errors'

const defaultCategories = [
  'Advice',
  'Animals',
  'Business',
  'Chipotle',
  'Concerts',
  'Convention'
]

const catOpts = [
  {
    text: 'Advice',
    value: 'advice'
  },
  {
    text: 'Animals',
    value: 'animals'
  }
]

class AskQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      question: '',
      categories: defaultCategories,
      category: '1',
      charCount: 300
    }
    this.handleQuestionChange = this.handleQuestionChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.submitQuestion = this.submitQuestion.bind(this)
    this.resetValues = this.resetValues.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.categories.length > 0 && this.props.categories.length === 0) {
      this.setState({ categories: nextProps.categories })
    }
  }

  handleQuestionChange (event) {
    let remainder = 300 - event.target.value.length
    this.setState({ question: event.target.value, charCount: remainder })
  }

  handleCategoryChange (event) {
    this.setState({ category: event.target.value })
  }

  resetValues () {
    this.setState({ question: '', category: '1', charCount: 300 })
  }

  submitQuestion () {
    let district, city
    if (!this.props.user.data) {
      console.log('User must be logged in to ask a question')
      return
    }

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

  renderSubmitButton () {
    const { user } = this.props
    let submitFunction
    if (user.data) {
      submitFunction = this.submitQuestion
    } else {
      submitFunction = this.props.showErrorNotification.bind(null, 'You must be logged in to ask a question')
    }
    return <span className='button' onClick={submitFunction}>Ask</span>
  }

  render () {
    return (
      <div>
        <Input
          size='medium'
          onChange={this.handleQuestionChange}
          label={{ basic: true, content: `${this.state.charCount}` }}
          labelPosition='right'
          placeholder='Ask a question...'
        />
        <Button primary onClick={this.submitQuestion}>Ask!</Button>
        <Dropdown compact placeholder='Category' onChange={this.handleCategoryChange} selection options={catOpts} />
        <select value={this.state.category} onChange={this.handleCategoryChange}>
          {this.state.categories.map((category, id) => <option key={id} value={id + 1}>{category}</option>)}
        </select>
        {this.renderSubmitButton()}
        <p>{`${this.state.charCount} characters remaining`}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    location: state.currentLocation.location,
    location_name: state.currentLocation.name,
    categories: state.questions.categoryList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    postQuestion: (data) => dispatch(postQuestion(data)),
    showErrorNotification: (msg) => dispatch(showErrorNotification(msg))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AskQuestion)
