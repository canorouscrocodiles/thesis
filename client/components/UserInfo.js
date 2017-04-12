import React, { Component } from 'react'
import { connect } from 'react-redux'

class UserInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <p>Username goes here</p>
        <p>Image goes here</p>
        <p>Description goes here</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(UserInfo)
