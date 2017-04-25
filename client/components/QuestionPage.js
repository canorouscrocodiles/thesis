import React from 'react'
import AnswerList from './AnswerList'
import MainQuestion from './MainQuestion'

export default (props) => {
  return (
    <div>
      <MainQuestion {...props} />
      <AnswerList {...props} />
    </div>
  )
}
