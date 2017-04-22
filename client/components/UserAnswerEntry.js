import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default (props) => {
  let humanTime = moment(props.answer.timestamp).fromNow()
  return (
    <div className='list-entry'>
      {props.answer.active_question ? <p>Active</p> : <p>Closed</p>}
      <p>{humanTime}</p>
      <p className='post-title'>Q: {props.answer.question_message}</p>
      <Link to={`/question/${props.answer.question_id}`}>A: {props.answer.message}</Link>
    </div>
  )
}
