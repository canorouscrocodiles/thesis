import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <div className='list-entry'>
      <img src={props.question.avatar} />
      <p><Link className='link post-title' to={`/question/${props.question.id}`}>{props.question.message}</Link></p>
      <p className='question-location'>{props.question.location}</p>
      <p>{props.question.username} - {humanTime}</p>
      <p>{props.question.category}</p>
    </div>
  )
}
