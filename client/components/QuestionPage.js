import React from 'react'
import AnswerList from './AnswerList'
import MainQuestion from './MainQuestion'

export default (props) => {
  return (
    <div>
      <MainQuestion id={props.match.params.id} from={props.from} />
      <AnswerList id={props.match.params.id} />
    </div>
  )
}
