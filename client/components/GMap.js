import React, { Component } from 'react'
import { connect } from 'react-redux'

// These are options used to initially render map
// center defines the center of the map
// minZoom defines the maximum zoom OUT
// maxZoom defines the maximum zoom IN
// zoom defines the starting zoom level
let options = {
  center: {lng: -122.41, lat: 37.78},
  minZoom: 5,
  maxZoom: 19,
  zoom: 11,
  draggable: false,
  streetViewControl: false,
  styles: [
    {
      'featureType': 'poi',
      'stylers': [
        { 'visibility': 'off' }
      ]
    }
  ]
}

let markers = []

class GMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      map: null,
      lastWindow: null,
      markers: []
    }
    this.loadMap = this.loadMap.bind(this)
    this.createMarker = this.createMarker.bind(this)
    this.createInfoWindow = this.createInfoWindow.bind(this)
    this.addPoints = this.addPoints.bind(this)
    this.deletePoints = this.deletePoints.bind(this)
    this.closeInfos = this.closeInfos.bind(this)
    this.resetView = this.resetView.bind(this)
  }

  loadMap () {
    // Check to see if window.google exists
    if (window.google) {
      // If so, create map object
      this.state.map = new window.google.maps.Map(document.getElementById('mapWindow'), options)
    } else {
      // Else, call itself
      setTimeout(this.loadMap, 100)
    }
  }

  // Creates markers given a map, position and icon
  createMarker (map, pos, icon, content) {
    // Create new marker
    let marker = new window.google.maps.Marker({
    // map determines which map object to set the marker on
    // position determines the latitude and longitude of marker
    // Format for pos: {lat: xx.xxxx, lng: xx.xxxx} lat and lng should be floating numbers
      map: map, position: pos, icon: icon
    })

    // If content was passed in, create an infoWindow for the marker
    if (content) {
      this.createInfoWindow(map, marker, content)
    }

    // Return marker object
    return marker
  }

  createInfoWindow (map, marker, content) {
    // Create a blank infoWindow
    let infoWindow = new window.google.maps.InfoWindow()

    // Set an event listener to listen for a click on the marker
    window.google.maps.event.addListener(marker, 'click', ((marker, content, infoWindow) => {
      // Here we are returning a function that retains access to the associated content and marker
      // through the use of closure
      return () => {
        // Close any open infoWindows
        this.closeInfos()
        // Set the infoWindow's content
        infoWindow.setContent(content)
        // Set the infoWindow's associated map and marker
        infoWindow.open(map, marker)
        // Setting lastWindow to reference the current infoWindow
        this.setState({lastWindow: infoWindow})
      }
    })(marker, content, infoWindow)) // Here we are immediately invoking our anonymous function with the current marker, content, and infoWindow
  }

  closeInfos () {
    // If an infoWindow is already open
    if (this.state.lastWindow) {
      // Disconnect it from the marker
      this.state.lastWindow.set('marker', null)
      // Close the infoWindow
      this.state.lastWindow.close()
      // Remove the reference to the lastWindow
      this.setState({lastWindow: null})
    }
  }

  addPoints (map, locations, index) {
    // Initialize variables
    let marker

    // Loop through all locations
    locations.forEach((location) => {
      let geojson = JSON.parse(location.st_asgeojson)
      let coordinates = {
        lng: geojson.coordinates[0],
        lat: geojson.coordinates[1]
      }
      // Create the marker
      marker = this.createMarker(map, coordinates, null, location.content)
      // Push the marker into markers for later referencing
      markers.push(marker)
    })
  }

  deletePoints (markers) {
    // Iterate through markers array
    markers.forEach(marker => {
      // Remove each marker from the map
      marker.setMap(null)
    })
    // Clear markers
    this.setState({markers: []})
  }

  resetView (map, positions) {
    // Create a new bounds object
    let bounds = new window.google.maps.LatLngBounds()
    positions.forEach(position => {
      let geojson = JSON.parse(position.st_asgeojson)
      let coordinates = {
        lng: geojson.coordinates[0],
        lat: geojson.coordinates[1]
      }
      bounds.extend(coordinates)
    })
    map.fitBounds(bounds)
  }

  componentDidMount () {
    this.loadMap()
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.map) {
      this.createMarker(this.state.map, nextProps.location)
      this.addPoints(this.state.map, nextProps.questions.data)
      this.resetView(this.state.map, nextProps.questions.data)
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

const mapStateToProps = state => {
  return { location: state.currentLocation.location, questions: state.questions }
}

export default connect(mapStateToProps)(GMap)
