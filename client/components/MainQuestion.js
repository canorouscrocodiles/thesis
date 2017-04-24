import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion } from '../actions/questions'
import { selectSingleUserQuestion } from '../actions/user'
import { enterRoom, leaveRoom, socketUpdateQuestion, deactivateQuestion } from '../actions/sockets/questions'
import moment from 'moment'

class MainQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: null,
      category_id: null,
      categories: ['Chipotle', 'Convention', 'Sports', 'Education', 'Advice', 'Traffic', 'Animals', 'Health', 'History', 'Tourism', 'Tech', 'Business', 'News', 'Food', 'Emergency', 'Music', 'Movies', 'TV', 'Life', 'Love', 'Politics'],
      charCount: 300,
      editing: false
    }
    this.updateQuestion = this.updateQuestion.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.handleQuestionChange = this.handleQuestionChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  componentWillMount () {
    const { from } = this.props
    if (from === 'home') {
      this.props.selectSingleQuestion(this.props.id)
    } else {
      this.props.selectSingleUserQuestion(this.props.id)
    }
  }

  componentWillUpdate (nextProps) {
    const user_id = this.props.user.data ? this.props.user.data.id : null
    const question_owner_id = nextProps.question ? nextProps.question.user_id : null
    let enterInfo = {
      user_id: user_id,
      question_id: this.props.id,
      question_creator: user_id === question_owner_id
    }
    this.props.enterRoom(enterInfo)
  }

  componentWillUnmount () {
    const user_id = this.props.user.data ? this.props.user.data.id : null
    const question_owner_id = this.props.question ? this.props.question.user_id : null
    let leaveInfo = {
      user_id: user_id,
      question_id: this.props.id,
      question_creator: user_id === question_owner_id
    }
    this.props.leaveRoom(leaveInfo)
  }

  handleQuestionChange (event) {
    let remaining = 300 - event.target.value.length
    this.setState({ message: event.target.value, charCount: remaining })
  }

  handleCategoryChange (event) {
    this.setState({ category_id: event.target.value })
  }

  updateQuestion () {
    if (this.state.message !== null) {
      if (this.state.message.length < 1) {
        this.state.message = null
      } else {
        this.props.question.message = this.state.message
        this.props.socketUpdateQuestion({id: this.props.question.id, message: this.props.question.message, category_id: this.state.category_id || this.props.question.category_id})
      }
    }
    this.setState({ editing: false })
  }

  cancelUpdate () {
    this.setState({ message: null, category_id: null, editing: false })
  }

  renderLoader () {
    return (<div>Loading...</div>)
  }

  renderEditButton () {
    const question = this.selectQuestion()
    const { currentUserId } = this.props
    const { user_id } = question
    if (currentUserId === user_id && question.active) {
      return <button className='button' onClick={() => this.setState({editing: true})}>Edit</button>
    } else {
      return null
    }
  }

  renderCloseButton () {
    const question = this.selectQuestion()
    const { currentUserId } = this.props
    const { user_id } = question
    if (currentUserId === user_id && question.active) {
      return <button className='button' onClick={() => this.props.deactivateQuestion(question.id)}>Close question</button>
    } else {
      return null
    }
  }

  selectQuestion () {
    let { question, userQuestion } = this.props
    if (!question) {
      question = userQuestion
    }
    return question
  }

  renderActivityLabel () {
    const question = this.selectQuestion()
    if (question.active) {
      return null
    } else {
      return <h3>This question is now closed</h3>
    }
  }

  render () {
    const question = this.selectQuestion()
    if (!question) { return this.renderLoader() }
    let humanTime = moment(question.timestamp).fromNow()
    if (!this.state.editing) {
      return (
        <div>
          <h2>{this.state.message !== null ? this.state.message : question.message}</h2>
          <p>{question.username} - {question.location}</p>
          <p>{humanTime} - {this.state.category_id !== null ? this.state.categories[this.state.category_id - 1] : question.category}</p>
          {this.renderEditButton()}
          {this.renderCloseButton()}
          {this.renderActivityLabel()}
        </div>
      )
    } else {
      return (
        <div>
          <textarea maxLength='300' cols='100' rows='4' value={this.state.message !== null ? this.state.message : question.message} onChange={this.handleQuestionChange} name='question' placeholder='Edit question...' />
          <select value={this.state.category_id !== null ? this.state.category_id : question.category} onChange={this.handleCategoryChange}>
            {this.state.categories.map((category, id) => <option key={id} value={id + 1}>{category}</option>)}
          </select>
          <p>{`${this.state.charCount} characters remaining`}</p>
          <span className='button' onClick={this.updateQuestion}>Save</span>
          <span className='button' onClick={this.cancelUpdate}>Cancel</span>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userQuestion: state.user.selectedQuestion,
    question: state.questions.selectedQuestion,
    currentUserId: state.user.data ? state.user.data.id : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    selectSingleUserQuestion: (id) => dispatch(selectSingleUserQuestion(id)),
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id)),
    deactivateQuestion: (id) => dispatch(deactivateQuestion(id)),
    socketUpdateQuestion: data => dispatch(socketUpdateQuestion(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
