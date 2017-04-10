import React, { Component } from 'react'

export default class CurrentLocation extends Component {
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
