import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectSingleQuestion, deactivateQuestion } from '../actions/questions'
import { enterRoom, leaveRoom, socketUpdateQuestion } from '../actions/sockets/questions'
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
    this.props.selectSingleQuestion(this.props.id)
  }

  componentWillUpdate (nextProps) {
    let enterInfo = {
      user_id: this.props.user.data.id,
      question_id: this.props.id,
      question_creator: this.props.user.data.id === nextProps.question.user_id
    }
    this.props.enterRoom(enterInfo)
  }

  componentWillUnmount () {
    let leaveInfo = {
      user_id: this.props.user.data.id,
      question_id: this.props.id,
      question_creator: this.props.user.data.id === this.props.question.user_id
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
    const { currentUserId, question } = this.props
    const { user_id } = question
    if (currentUserId === user_id) {
      return <button className='button' onClick={() => this.setState({editing: true})}>Edit</button>
    } else {
      return null
    }
  }

  renderCloseButton () {
    const { currentUserId, question } = this.props
    const { user_id } = question
    if (currentUserId === user_id) {
      return <button className='button' onClick={() => this.props.deactivateQuestion(question.id)}>Close question</button>
    } else {
      return null
    }
  }

  render () {
    const { question } = this.props
    let humanTime = moment(question.timestamp).fromNow()
    if (!question) { return this.renderLoader() }
    if (!this.state.editing) {
      return (
        <div>
          <h2>{this.state.message !== null ? this.state.message : question.message}</h2>
          <p>{question.username} - {question.location}</p>
          <p>{humanTime} - {this.state.category_id !== null ? this.state.categories[this.state.category_id - 1] : question.category}</p>
          {this.renderEditButton()}
          {this.renderCloseButton()}
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
    question: state.questions.selectedQuestion,
    currentUserId: state.user.data ? state.user.data.id : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectSingleQuestion: (id) => dispatch(selectSingleQuestion(id)),
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id)),
    deactivateQuestion: (id) => dispatch(deactivateQuestion(id)),
    socketUpdateQuestion: data => dispatch(socketUpdateQuestion(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
