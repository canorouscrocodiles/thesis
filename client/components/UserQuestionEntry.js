import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Feed, Label } from 'semantic-ui-react'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <Feed.Event>
      <Feed.Content>
        <Feed.Summary>
          <Link to={`/question/${props.question.id}`}>{props.question.message}</Link>
          <Feed.Date>
            {humanTime}{' '}
            <Label>
              {props.question.active ? 'Active' : 'Closed'}
            </Label>
          </Feed.Date>
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  )
}
