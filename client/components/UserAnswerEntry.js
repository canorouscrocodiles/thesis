import React from 'react'
import moment from 'moment'

export default (props) => {
  let humanTime = moment(props.answer.timestamp).fromNow()
  return (
    <div className='list-entry'>
      <p>{humanTime}</p>
      <p className='post-title'>Q: {props.answer.question_message}</p>
      <p >A: {props.answer.message}</p>
    </div>
  )
}
