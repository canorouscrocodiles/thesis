import React from 'react'

export default (props) => (
  <div className='list-entry'>
    <p>{props.answer.username}</p>
    <img src={props.answer.avatar} />
    <p className='post-title'>{props.answer.message}</p>
    <p>{props.answer.timestamp}</p>
  </div>
)
