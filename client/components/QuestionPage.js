import React from 'react'
import AnswerList from './AnswerList'
import MainQuestion from './MainQuestion'

export default (props) => {
  return (
    <div>
      <MainQuestion id={props.match.params.id} />
      <AnswerList id={props.match.params.id} />
    </div>
  )
}
