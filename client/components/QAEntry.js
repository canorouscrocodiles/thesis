import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import updateVote from '../actions/sockets/votes'
import { socketUpdateAnswer } from '../actions/sockets/answer'
import { showErrorNotification } from '../actions/errors'
import { Card, Segment, Image, Button, Icon, Label, Input } from 'semantic-ui-react'

class QAEntry extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: null,
      charCount: 300,
      editing: false
    }
    this.handleAnswerChange = this.handleAnswerChange.bind(this)
    this.updateAnswer = this.updateAnswer.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
  }

  handleAnswerChange (event) {
    let remaining = 300 - event.target.value.length
    this.setState({ message: event.target.value, charCount: remaining })
  }

  updateAnswer () {
    const { socketUpdateAnswer } = this.props
    if (this.state.message !== null) {
      if (this.state.message.length < 1) {
        this.state.message = null
      } else {
        this.props.answer.message = this.state.message
        socketUpdateAnswer(this.props.answer.message)
      }
    }
    this.setState({ editing: false })
  }

  cancelUpdate () {
    this.setState({ message: null, editing: false })
  }

  renderEditButton () {
    if (!this.props.user.data) { return null }
    const { id } = this.props.user.data
    const { user_id } = this.props.answer
    const { activeQuestion } = this.props
    if (id === user_id && activeQuestion) {
      return <Button onClick={() => this.setState({editing: true})}>Edit</Button>
    } else {
      return null
    }
  }

  renderVotingStyles (dependentOn) {
    const { users_vote_count } = this.props
    if (users_vote_count === dependentOn) {
      return 'mainColor'
    } else {
      return 'grey'
    }
  }

  renderVoteButtons () {
    const { updateVote, activeQuestion, user } = this.props
    if (!activeQuestion) {
      return (
        <div>
          <Icon circular name='thumbs up' className={this.renderVotingStyles(1)} />
          <Label circular className='mainColor'>{this.props.answer.vote_count} </Label>
          <Icon circular name='thumbs down' className={this.renderVotingStyles(-1)} />
        </div>
      )
    }
    if (!user.data) {
      const f = this.props.showErrorNotification.bind(null, 'You must be logged in to vote')
      return (
        <div>
          <Icon circular name='thumbs up' onClick={f} style={{cursor: 'pointer'}} />
          <Label circular className='mainColor'>{this.props.answer.vote_count} </Label>
          <Icon circular name='thumbs down' onClick={f} style={{cursor: 'pointer'}} />
        </div>
      )
    }
    return (
      <div>
        <Icon circular name='thumbs up' className={this.renderVotingStyles(1)} onClick={() => updateVote && updateVote(1)} style={{cursor: 'pointer'}} />
        <Label circular className='mainColor'>{this.props.answer.vote_count} </Label>
        <Icon circular name='thumbs down' className={this.renderVotingStyles(-1)} onClick={() => updateVote && updateVote(-1)} style={{cursor: 'pointer'}} />
      </div>
    )
  }

  render () {
    const humanTime = moment(this.props.answer.timestamp).fromNow()
    if (!this.state.editing) {
      return (
        <Segment basic className='list-entry'>
          <Card fluid>
            <Card.Content>
              <Image floated='left' size='mini' src={this.props.answer.avatar} />
              <Card.Header>{this.props.answer.username}</Card.Header>
              <Card.Meta>{humanTime}</Card.Meta>
              <Card.Description>{this.state.message !== null ? this.state.message : this.props.answer.message}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              {this.renderVoteButtons()}
              {this.renderEditButton()}
            </Card.Content>
          </Card>
        </Segment>
      )
    } else {
      const msg = this.state.message ? this.state.message : this.props.answer.message
      return (
        <Segment basic className='list-entry'>
          <Card fluid>
            <Card.Content>
              <Image floated='left' size='mini' src={this.props.answer.avatar} />
              <Card.Header>{this.props.answer.username}</Card.Header>
              <Card.Meta>{humanTime}</Card.Meta>
              <Card.Description>
                <Input
                  fluid
                  value={msg}
                  onChange={this.handleAnswerChange}
                  name='answer'
                  label={{ basic: true, content: `${this.state.charCount}` }}
                  labelPosition='right'
                />
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button.Group>
                <Button color='grey' onClick={this.cancelUpdate}>Cancel</Button>
                <Button className='mainColor' onClick={this.updateAnswer}>Save</Button>
              </Button.Group>
            </Card.Content>
          </Card>
        </Segment>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = state.user.data && state.user.data.id ? state.user.data.id : null
  return { user: state.user, user_id: id, users_vote_count: ownProps.answer.users_vote_count }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    showErrorNotification: msg => dispatch(showErrorNotification(msg)),
    updateVote: stateProps.user_id ? (vote_type) => dispatch(updateVote(ownProps.answer.id, ownProps.answer.question_id, stateProps.user_id, vote_type)) : null,
    socketUpdateAnswer: (message) => dispatch(socketUpdateAnswer({ id: ownProps.answer.id, question_id: ownProps.answer.question_id, message: message }))
  }
}

export default connect(mapStateToProps, null, mergeProps)(QAEntry)
