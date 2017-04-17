import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => (
  <div className='list-entry'>
    <p><Link className='link post-title' to={`/question/${props.question.id}`}>{props.question.message}</Link></p>
    <p className='question-location'>{props.question.location}</p>
    <p>{props.question.username} - {props.question.timestamp}</p>
    <p>{props.question.category}</p>
  </div>
)
