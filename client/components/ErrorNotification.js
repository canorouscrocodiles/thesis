import React from 'react'

export default (props) => {
  if (props.error) {
    return (
      <div className='error-notification'>
        <span className='error-text'>{props.error}</span>
      </div>
    )
  } else {
    return null
  }
}
