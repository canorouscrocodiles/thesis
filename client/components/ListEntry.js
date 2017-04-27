import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Card, Divider, Image, Item, Segment } from 'semantic-ui-react'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <Segment basic>
      <Link className='link post-title' to={`/question/${props.question.id}`}>
        <Card
          fluid
          color='blue'
          header={props.question.message}
          meta={props.question.username}
          description={props.question.location}
        />
      </Link>
    </Segment>
  )
}
