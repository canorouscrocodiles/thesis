import React from 'react'
import UserInfo from './UserInfo'

export default (props) => (
  <div>
    <UserInfo id={props.match.params.id} />
  </div>
)
