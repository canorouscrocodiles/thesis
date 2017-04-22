import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <div className='list-entry'>
      {props.question.active ? <p>Active</p> : <p>Closed</p>}
      <p>{humanTime}</p>
      <Link to={`/question/${props.question.id}`} className='post-title'>{props.question.message}</Link>
    </div>
  )
}
