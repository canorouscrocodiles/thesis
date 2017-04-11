import React, { Component } from 'react'
import Map from './Map'
import GoogleApiComponent from './../js/gMaps/GoogleApiComponent'

export class MapContainer extends Component {

  render () {
    console.log('API Loaded?', this.props.loaded)
    console.log('Map object', this.props.google)
    if (!this.props.loaded) {
      return <div>Map loading...</div>
    }
    return (
      <div id='mapWindow'>
        <Map google={this.props.google} />
      </div>
    )
  }
}

export default GoogleApiComponent({
  apiKey: process.env.GMAP_API || 'AIzaSyCrrF_JAPp0HljxaSSiJofc7g6zfr-WJSI'
})(MapContainer)
