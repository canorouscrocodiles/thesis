import React from 'react'
import AnswerList from './AnswerList'
import MainQuestion from './MainQuestion'
import AddAnswer from './AddAnswer'

export default (props) => {
  return (
    <div>
      <MainQuestion id={props.match.params.id} />
      <AnswerList id={props.match.params.id} />
      <AddAnswer id={props.match.params.id} />
    </div>
  )
}
