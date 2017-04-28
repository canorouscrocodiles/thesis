import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUser, fetchUserQuestions, fetchUserAnswers } from '../actions/user'
import { Container, Dimmer, Header, Image, Loader, Segment } from 'semantic-ui-react'
import UserQuestions from './UserQuestions'
import UserAnswers from './UserAnswers'

class UserInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 'questions'
    }
  }

  componentWillMount () {
    this.props.fetchUser(this.props.match.params.id)
    this.props.fetchUserQuestions(this.props.match.params.id)
    this.props.fetchUserAnswers(this.props.match.params.id)
  }

  handleSelectedTab (option) {
    this.setState({ selectedTab: option })
  }

  render () {
    if (!this.props.user.data) {
      return (
        <Segment raised>
          <Dimmer active inverted>
            <Loader size='massive' inline='centered'>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    } else {
      return (
        <div>
          <Segment raised>
            <Container text>
              <Image centered src={this.props.user.data.img_url} width='200em' height='200em' shape='rounded' />
              <Header as='h2'>{this.props.user.data.username}</Header>
              <p>{this.props.user.data.bio}</p>
            </Container>
          </Segment>
          <Segment raised>
            <span onClick={() => this.handleSelectedTab('questions')}>My Questions</span> | <span onClick={() => this.handleSelectedTab('answers')}>My Answers</span>
          </Segment>

          { this.state.selectedTab === 'questions' ? <UserQuestions /> : <UserAnswers /> }
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (userId) => dispatch(fetchUser(userId)),
    fetchUserQuestions: (userId) => dispatch(fetchUserQuestions(userId)),
    fetchUserAnswers: (userId) => dispatch(fetchUserAnswers(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
