import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortQuestions, changeOption, changeValue } from '../actions/questions'
import ListEntry from './ListEntry'
import UnreadNotification from './UnreadNotification'
import { Dimmer, Divider, Dropdown, Icon, Loader, Segment } from 'semantic-ui-react'

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: [],
      sortOptions: [
        { key: 'New', value: 'New', text: 'New' },
        { key: 'Trending', value: 'Trending', text: 'Trending' },
        { key: 'Distance', value: 'Distance', text: 'Distance' },
        { key: 'Old', value: 'Old', text: 'Old' }
      ],
      option: 0
    }

    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
  }

  handleOptionChange (event, data) {
    console.log(data.value)
    this.props.changeOption(data.value)

    // let selectedCategories = this.props.value.map(x => x.value)
    this.props.sortQuestions(data.value, this.props.value)
  }

  handleCategoryChange (event, data) {
    console.log('You\'ve selected:', data.value)
    // this.props.changeValue(data.value)

    console.log('sortBy ', this.props.option)
    this.props.sortQuestions(this.props.option, data.value)
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
      <h3>
        <Icon name='marker' color='grey' size='big' />Questions around { `${district}, ${city}` }
      </h3>
    )
  }

  scrollToTop () {
    var elmnt = document.getElementById('postlist')
    elmnt.scrollTop = 0
  }

  renderMessage () {
    if (!this.props.currentLocation.name) {
      return (
        <h3><Loader indeterminate active inline /> Finding your location...</h3>
      )
    }
    return this.locationLoaded()
  }

  renderUnread () {
    if (this.props.unread) {
      return <UnreadNotification />
    }
  }

  renderPostList () {
    if (this.props.questions.data.length === 0 && this.props.currentLocation.location) {
      return (
        <Segment raised textAlign='center'>
          <p>There are no questions around you.</p>
          <p>😞</p>
          <p>Post a question you want answered!</p>
        </Segment>
      )
    } else if (this.props.questions.data.length === 0) {
      return (
        <div className='post-list-loading'>
          <Dimmer active inverted>
            <Loader size='massive' inline='centered'>Getting Questions</Loader>
          </Dimmer>
        </div>
      )
    } else {
      return (
        <div id='postlist' className='post-list'>
          {this.props.questions.data.map(question => <ListEntry key={question.id} question={question} />)}
        </div>
      )
    }
  }

  render () {
    return (
      <div>
        <Segment basic>
          <Segment textAlign='center' raised>
            {this.renderMessage()}
            <Dropdown
              placeholder='Sort'
              selection
              defaultValue={this.props.option}
              options={this.state.sortOptions}
              onChange={this.handleOptionChange}
            />
            <Dropdown
              placeholder='Filter categories'
              multiple
              selection
              defaultValue={this.props.categories}
              options={this.props.categoryOptions}
              onChange={this.handleCategoryChange}
            />
          </Segment>
          <Divider hidden />
          {this.renderUnread()}
          {this.renderPostList()}
          <div className='back-to-top'>
            <Icon color='green' size='huge' name='toggle up' onClick={this.scrollToTop} />
          </div>
        </Segment>
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
