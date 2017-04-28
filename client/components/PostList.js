import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortQuestions, changeOption, changeValue } from '../actions/questions'
import ListEntry from './ListEntry'
import UnreadNotification from './UnreadNotification'
import { Dimmer, Divider, Dropdown, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react'

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
      defaultSort: '',
      defaultCategories: []
    }

    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  componentDidMount () {
    this.setState({ defaultSort: this.props.option, defaultCategories: this.props.categories })
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
          <Header as='h3'>There are no questions around you.</Header>
          <Header as='h3'>😞</Header>
          <Header as='h3'>Post a question you want answered!</Header>
        </Segment>
      )
    } else if (this.props.questions.data.length === 0) {
      return (
        <Segment raised>
          <Dimmer active inverted>
            <Loader size='massive' inline='centered'>Loading Questions</Loader>
          </Dimmer>
          <Image src='https://react.semantic-ui.com/assets/images/wireframe/paragraph.png' />
          <Divider />
          <Image src='https://react.semantic-ui.com/assets/images/wireframe/paragraph.png' />
        </Segment>
      )
    } else {
      return (
        <div id='postlist' className='post-list'>
          {this.props.questions.data.map(question => question.active ? <ListEntry key={question.id} question={question} /> : null)}
        </div>
      )
    }
  }

  render () {
    return (
      <div className='questions'>
        <Segment basic>
          <Segment textAlign='center' raised>
            {this.renderMessage()}
            <Dropdown
              placeholder='Sort'
              selection
              defaultValue={this.state.defaultSort}
              options={this.state.sortOptions}
              onChange={this.handleOptionChange}
            />
            <Dropdown
              placeholder='Filter categories'
              multiple
              selection
              defaultValue={this.state.defaultCategories}
              options={this.props.categoryOptions}
              onChange={this.handleCategoryChange}
            />
          </Segment>
          <Divider hidden />
          {this.renderUnread()}
          {this.renderPostList()}
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
