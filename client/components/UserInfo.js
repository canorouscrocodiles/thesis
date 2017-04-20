import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUser, fetchUserQuestions, fetchUserAnswers } from '../actions/user'
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
    this.props.fetchUser(this.props.id)
    this.props.fetchUserQuestions(this.props.id)
    this.props.fetchUserAnswers(this.props.id)
  }

  handleSelectedTab (option) {
    this.setState({ selectedTab: option })
  }

  render () {
    if (!this.props.user.data) {
      return (<div> LOADING... </div>)
    } else {
      return (
        <div>
          <div>
            <p>{this.props.user.data.username}</p>
            <p><img src={this.props.user.data.img_url} /></p>
            <p>{this.props.user.data.bio}</p>
          </div>
          <div>
            <span onClick={() => this.handleSelectedTab('questions')}>My Questions</span> | <span onClick={() => this.handleSelectedTab('answers')}>My Answers</span>
          </div>

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
