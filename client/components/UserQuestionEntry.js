import React from 'react'
import moment from 'moment'

export default (props) => {
  let humanTime = moment(props.question.timestamp).fromNow()
  return (
    <div className='list-entry'>
      <p>{humanTime}</p>
      <p className='post-title'>{props.question.message}</p>
    </div>
  )
}
