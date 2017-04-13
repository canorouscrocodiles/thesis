import React, { Component } from 'react'
import { connect } from 'react-redux'

class CurrentLocation extends Component {
  locationLoaded () {
    let location = this.props.currentLocation.address_components
    let district = location[2].long_name
    let city = location[3].long_name
    return (
      <p>{ `${district}, ${city}` }</p>
    )
  }

  render () {
    return (
      <div>
        <h4>Current Location</h4>
        {this.props.currentLocation ? this.locationLoaded() : <div>LOADING...</div>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { currentLocation: state.currentLocation.name }
}

export default connect(mapStateToProps)(CurrentLocation)
