import React from 'react'
import moment from 'moment'

export default (props) => {
  let humanTime = moment(props.answer.timestamp).fromNow()
  return (
    <div className='list-entry'>
      <p>{props.answer.username}</p>
      <img src={props.answer.avatar} />
      <p className='post-title'>{props.answer.message}</p>
      <p>{humanTime}</p>
    </div>
  )
}
