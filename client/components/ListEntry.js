import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Divider, Feed, Icon, Image, Label, Segment } from 'semantic-ui-react'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <Feed.Event>
      <Segment raised>
        <Feed.User>
          <Image verticalAlign='middle' floated='left' src={props.question.avatar} width='55em' height='55em' />
          <span>{props.question.username} - {humanTime}</span>
        </Feed.User>
        <Feed.Content>
          <Link className='link post-title' to={`/question/${props.question.id}`}>
            <Feed.Extra text>
              <h2>{props.question.message}</h2>
            </Feed.Extra>
          </Link>
          <Feed.Meta>
            <Divider hidden />
            <Icon name='marker' />
            {props.question.location}
          </Feed.Meta>
        </Feed.Content>
        <Label color='blue' attached='bottom right'><Icon name='hashtag' />{props.question.category}</Label>
      </Segment>
      <Divider hidden />
    </Feed.Event>
  )
}
