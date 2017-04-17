import React from 'react'
import AnswerList from './AnswerList'
import MainQuestion from './MainQuestion'
import Menu from './Menu'
import GMap from './GMap'

export default (props) => {
  return (
    <div>
      <Menu />
      <GMap />
      <MainQuestion id={props.match.params.id} />
      <AnswerList id={props.match.params.id} />
    </div>
  )
}
