import React from 'react'
import AnswerList from './AnswerList'
import MainQuestion from './MainQuestion'
import { Segment } from 'semantic-ui-react'

export default (props) => {
  return (
    <Segment basic>
      <MainQuestion {...props} />
      <AnswerList {...props} />
    </Segment>
  )
}
