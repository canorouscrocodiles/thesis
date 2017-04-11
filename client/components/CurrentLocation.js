import React, { Component } from 'react'
import { connect } from 'react-redux'

class CurrentLocation extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h4>Current Location</h4>
        <p>South of Market St</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { currentLocation: state.currentLocation }
}

export default connect(mapStateToProps)(CurrentLocation)
