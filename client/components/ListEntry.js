import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => (
  <div>
    <p><Link to={`/question/${props.question.id}`}>{props.question.message}</Link></p>
    <p>{props.question.location}</p>
  </div>
)
