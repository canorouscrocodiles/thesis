import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Divider, Feed, Icon, Image, Segment } from 'semantic-ui-react'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <Feed.Event>
      <Segment raised>
        <Feed.User>
          <Image verticalAlign='middle' floated='left' src={props.question.avatar} width='50em' height='50em' shape='circular' />
          <span>{props.question.username}</span>
        </Feed.User>
        <Feed.Content>
          <Feed.Summary>
            <Feed.Date>{humanTime}</Feed.Date>
          </Feed.Summary>
          <Link className='link post-title' to={`/question/${props.question.id}`}>
            <Feed.Extra text>
              <h2>{props.question.message}</h2>
            </Feed.Extra>
          </Link>
          <Feed.Meta>
            <Feed.Like>
              <Icon name='marker' />
              {props.question.location}
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Segment>
      <Divider hidden />
    </Feed.Event>
  )
}
