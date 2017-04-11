import React, { Component } from 'react'

let options = {
  center: {lng: -122.41, lat: 37.78},
  minZoom: 5,
  maxZoom: 19,
  zoom: 11
}

let map

window.loadMap = () => {
  if (window.google) {
    map = new window.google.maps.Map(document.getElementById('mapWindow'), options)
  } else {
    setTimeout(window.loadMap, 100)
  }
}

export default class GMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div id='mapWindow'>
        Map loading...
      </div>
    )
  }
}
