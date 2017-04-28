import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Feed, Label } from 'semantic-ui-react'

export default (props) => {
  let humanTime = moment(props.answer.timestamp).fromNow()
  return (
    <Feed.Event>
      <Feed.Content>
        <Feed.Summary>
          {props.answer.question_message}
          <Feed.Date>
            {humanTime}{' '}
            <Label>
              {props.answer.active_question ? 'Active' : 'Closed'}
            </Label>
          </Feed.Date>
        </Feed.Summary>
        <Feed.Extra>
          I replied: <Link to={`/question/${props.answer.question_id}`}>{props.answer.message}</Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  )
}
