import React from 'react'
import Menu from './Menu'
import GMap from './GMap'
import UserInfo from './UserInfo'

export default (props) => (
  <div>
    <Menu />
    <GMap />
    <UserInfo id={props.match.params.id} />
  </div>
)
