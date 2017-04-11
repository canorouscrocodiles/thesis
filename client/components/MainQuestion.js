import React, { Component } from 'react'
import { connect } from 'react-redux'

class MainQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <p>Keith - 22s ago</p>
        <p>Is Chipotle out of guac?!</p>
        <p>Hack Reactor</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { questions: state.questions }
}

export default connect(mapStateToProps)(MainQuestion)
