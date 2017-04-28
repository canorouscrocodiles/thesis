import React, { Component } from 'react'
import { connect } from 'react-redux'
import { enterRoom, leaveRoom, socketUpdateQuestion, deactivateQuestion } from '../actions/sockets/questions'
import { sortAnswers } from '../actions/answer'
import moment from 'moment'
import AddAnswer from './AddAnswer'
import { Segment, Header, Label, Icon, Button, Form, TextArea, Dropdown, Divider } from 'semantic-ui-react'

class MainQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: null,
      category_id: null,
      categories: ['Chipotle', 'Convention', 'Sports', 'Education', 'Advice', 'Traffic', 'Animals', 'Health', 'History', 'Tourism', 'Tech', 'Business', 'News', 'Food', 'Emergency', 'Music', 'Movies', 'TV', 'Life', 'Love', 'Politics'],
      charCount: 300,
      editing: false,
      sortOptions: [ 'New', 'Trending', 'Old' ],
      option: 0
    }
    this.updateQuestion = this.updateQuestion.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.handleQuestionChange = this.handleQuestionChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
  }

  componentWillMount () {
    const user_id = this.props.user.data ? this.props.user.data.id : null
    let index = this.state.sortOptions.findIndex(x => x === this.props.sortBy)
    this.setState({ option: index })
    let enterInfo = {
      user_id: user_id,
      question_id: this.props.id,
      question_creator: user_id === this.props.question.user_id
    }
    this.props.enterRoom(enterInfo)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.answers.length !== this.props.answers.length) {
      this.props.sortAnswers(this.state.sortOptions[this.state.option])
    }
  }

  componentWillUnmount () {
    const user_id = this.props.user.data ? this.props.user.data.id : null
    let leaveInfo = {
      user_id: user_id,
      question_id: this.props.id,
      question_creator: user_id === this.props.question.user_id
    }
    this.props.leaveRoom(leaveInfo)
  }

  handleOptionChange (event, data) {
    this.setState({ option: data.value })
    this.props.sortAnswers(this.state.sortOptions[data.value])
  }

  handleQuestionChange (event) {
    let remaining = 300 - event.target.value.length
    this.setState({ message: event.target.value, charCount: remaining })
  }

  handleCategoryChange (event, data) {
    this.setState({ category_id: data.value })
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

  renderEditButtons () {
    const { question, user } = this.props
    const id = user.data ? user.data.id : null
    const { user_id } = question
    if (id === user_id && question.active) {
      return (
        <Button.Group>
          <Button onClick={() => this.setState({editing: true})}>Edit</Button>
          <Button color='red' onClick={() => this.props.deactivateQuestion(question.id)}>Close question</Button>
        </Button.Group>
      )
    } else {
      return null
    }
  }

  renderActivityLabel () {
    const { question } = this.props
    if (question.active) {
      return null
    } else {
      return <Label color='red' tag>This question is now closed</Label>
    }
  }

  renderAnswerTitle () {
    const { answers, question } = this.props
    if (answers.length === 1) {
      return <Header as='h2'>1 Answer</Header>
    } else if (answers.length > 1) {
      return <Header as='h2'>{answers.length} Answers</Header>
    } else if (question.active) {
      return <Header as='h2' textAlign='center'>Waiting for answers...</Header>
    } else {
      return null
    }
  }

  renderSortDropdown () {
    const { answers, question } = this.props
    const options = this.state.sortOptions.map((option, i) => ({ text: option, value: i }))
    const text = this.state.sortOptions[this.state.option]
    if (answers.length === 0 || !question.active) { return null }
    return <Dropdown selection closeOnChange text={text} onChange={this.handleOptionChange} options={options} />
  }

  render () {
    const { question } = this.props
    const styles = {
      bold: { 'fontWeight': 'bold' },
      italic: { 'fontStyle': 'italic' }
    }
    if (!question) { return this.renderLoader() }
    let humanTime = moment(question.timestamp).fromNow()
    if (!this.state.editing) {
      return (
        <Segment>
          <Header as='h2'>
            {this.state.message !== null ? this.state.message : question.message}
            <Header.Subheader><span style={styles.bold}>{question.username}</span> - <span style={styles.italic}>{humanTime} in {question.location}</span> </Header.Subheader>
            <Label><Icon name='hashtag' />{this.state.category_id ? this.state.categories[this.state.category_id - 1] : question.category}</Label>
          </Header>
          {this.renderEditButtons()}
          {this.renderActivityLabel()}
          <Divider />
          <AddAnswer id={this.props.id} activeQuestion={question.active} />
          {this.renderAnswerTitle()}
          {this.renderSortDropdown()}
        </Segment>
      )
    } else {
      const options = this.state.categories.map((category, id) => ({ text: category, value: id + 1 }))
      const text = this.state.category_id ? this.state.categories[this.state.category_id - 1] : question.category
      const message = this.state.message ? this.state.message : question.message
      return (
        <Segment>
          <Form>
            <h2>Question</h2>
            <TextArea autoHeight value={message} onChange={this.handleQuestionChange} name='question' />
            <p>{`${this.state.charCount} characters remaining`}</p>
            <h2>Category</h2>
            <Dropdown fluid selection closeOnChange text={text} onChange={this.handleCategoryChange} options={options} />
          </Form>
          <Button.Group>
            <Button color='red' onClick={this.cancelUpdate}>Cancel</Button>
            <Button color='green' onClick={this.updateQuestion}>Save</Button>
          </Button.Group>
        </Segment>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    sortBy: state.answers.sortBy,
    answers: state.answers.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    enterRoom: (id) => dispatch(enterRoom(id)),
    leaveRoom: (id) => dispatch(leaveRoom(id)),
    deactivateQuestion: (id) => dispatch(deactivateQuestion(id)),
    socketUpdateQuestion: data => dispatch(socketUpdateQuestion(data)),
    sortAnswers: (sortBy) => dispatch(sortAnswers(sortBy))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainQuestion)
