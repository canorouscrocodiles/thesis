import React, { Component } from 'react'
import { connect } from 'react-redux'
import utils from '../utils'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

// These are options used to initially render map
// center defines the center of the map
// minZoom defines the maximum zoom OUT
// maxZoom defines the maximum zoom IN
// zoom defines the starting zoom level
let options = {
  center: {lng: -122.41, lat: 37.78},
  minZoom: 16,
  maxZoom: 19,
  zoom: 16,
  draggable: true,
  streetViewControl: false,
  mapTypeControl: false,
  zoomControl: true,
  styles: [
    {
      'featureType': 'poi',
      'stylers': [
        { 'visibility': 'off' }
      ]
    }
  ]
}

class GMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      map: null,
      lastWindow: null,
      markers: [],
      userCircle: null,
      currentZoom: 16,
      minDist: {
        16: 58,
        17: 35,
        18: 20,
        19: 8
      }
    }
    this.loadMap = this.loadMap.bind(this)
    this.createCircle = this.createCircle.bind(this)
    this.createUserCircle = this.createUserCircle.bind(this)
    this.createOrUpdateUserCircle = this.createOrUpdateUserCircle.bind(this)
    this.createInfoWindow = this.createInfoWindow.bind(this)
    this.addPoints = this.addPoints.bind(this)
    this.updatePoints = this.updatePoints.bind(this)
    this.deletePoints = this.deletePoints.bind(this)
    this.closeInfos = this.closeInfos.bind(this)
    this.resetView = this.resetView.bind(this)
  }

  loadMap () {
    // Check to see if window.google exists
    if (window.google) {
      // If so, create map object
      this.state.map = new window.google.maps.Map(document.getElementById('mapWindow'), options)
      this.state.map.addListener('zoom_changed', () => {
        this.state.currentZoom = this.state.map.getZoom()
        this.updatePoints(this.state.map, this.props.questions.data, this.state.currentZoom, this.state.minDist[this.state.currentZoom], this.props.location)
      })
    } else {
      // Else, call itself
      setTimeout(this.loadMap, 100)
    }
  }

  createCircle (map, position, radius = 10, color = '#429bf4', count) {
    if (count === 1) {
      count = ' '
    } else {
      count = count.toString()
    }

    let fontSize = '12px'

    // Starting font size plus constant * number of questions
    if (count > 1) {
      fontSize = `${(12 + (0.35 * count))}px`
    }

    let circle = new window.google.maps.Marker({
      map: map,
      position: position,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: radius,
        fillColor: '#75aaff',
        fillOpacity: 0.9,
        strokeColor: '#5e9cff',
        strokeWeight: 1
      },
      label: {
        text: count,
        color: 'white',
        fontSize: fontSize,
        fontWeight: 'bold'
      },
      clickable: true,
      flat: true,
      optimized: false // Test this
    })

    return circle
  }

  createUserCircle (map, position, radius) {
    let innerCircle = new window.google.maps.Marker({
      map: map,
      position: position,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: 'red',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2
      },
      clickable: false,
      flat: true,
      zIndex: 0,
      optimized: false
    })

    let outerCircle = new window.google.maps.Circle({
      map: map,
      center: position,
      radius: radius,
      fillColor: '#429bf4',
      fillOpacity: 0,
      strokeColor: '#429bf4',
      strokeOpacity: 0.50,
      strokeWeight: 1.25,
      clickable: false,
      zIndex: 0
    })

    this.state.userCircle = {
      inner: innerCircle,
      outer: outerCircle
    }
  }

  createOrUpdateUserCircle (map, position) {
    if (this.state.userCircle) {
      this.state.userCircle.inner.setPosition(position)
      this.state.userCircle.outer.setCenter(position)
    } else {
      this.createUserCircle(map, position, 402)
    }
  }

  createInfoWindow (map, marker, questions) {
    // Create a blank infoWindow
    let infoWindow = new window.google.maps.InfoWindow()
    let innerHTML = document.createElement('div')
    let list = document.createElement('ul')
    questions.forEach(question => {
      let item = document.createElement('li')
      item.className = 'infoListItem'
      item.appendChild(document.createTextNode(`- ${question.question}`))
      list.appendChild(item)
    })
    innerHTML.appendChild(list)

    // Set an event listener to listen for a click on the marker
    window.google.maps.event.addListener(marker, 'click', ((marker, content, infoWindow) => {
      // Here we are returning a function that retains access to the associated content and marker
      // through the use of closure
      return () => {
        // If the window is already open
        if (this.state.lastWindow === infoWindow) {
          // Just close it
          this.closeInfos()
        } else {
          // Close any open infoWindows
          this.closeInfos()
          // Set the infoWindow's content
          infoWindow.setContent(content)
          // Set the infoWindow's associated map and position
          infoWindow.setPosition(marker.position)
          infoWindow.open(map)
          // Set lastWindow to reference the current infoWindow
          this.state.lastWindow = infoWindow
        }
      }
    })(marker, innerHTML, infoWindow)) // Here we are immediately invoking our anonymous function with the current marker, content, and infoWindow
  }

  closeInfos () {
    // If an infoWindow is already open
    if (this.state.lastWindow) {
      // Disconnect it from the marker
      this.state.lastWindow.set('marker', null)
      // Close the infoWindow
      this.state.lastWindow.close()
      // Remove the reference to the lastWindow
      this.state.lastWindow = null
    }
  }

  addPoints (map, locations, color) {
    // Delete all existing points
    this.deletePoints(this.state.markers)
    // Initialize variables
    let marker
    // Loop through all locations
    locations.forEach((location) => {
      // Create the marker
      marker = this.createCircle(map, location.coordinates, location.radius, color, location.questions.length)
      this.createInfoWindow(map, marker, location.questions)
      // Push the marker into markers for later referencing
      this.state.markers.push(marker)
    })
  }

  updatePoints (map, points, zoom, minDist, location) {
    var centroids = utils.clusterPoints(points, minDist, location)
    var transformed = utils.transformClusterToPoints(centroids, zoom)
    this.addPoints(map, transformed)
  }

  deletePoints (markers) {
    // Iterate through markers array
    markers.forEach(marker => {
      // Remove each marker from the map
      marker.setMap(null)
    })
    // Clear markers
    markers = []
  }

  resetView (map, positions) {
    // Create a new bounds object
    let bounds = new window.google.maps.LatLngBounds()
    positions.forEach(position => {
      let coordinates = utils.parseGeoJSON(position)
      bounds.extend(coordinates)
    })
    map.fitBounds(bounds)
  }

  componentDidMount () {
    this.loadMap()
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.map) {
      this.createOrUpdateUserCircle(this.state.map, nextProps.location)
      if (nextProps.location && nextProps.questions.data.length > 0) {
        this.updatePoints(this.state.map, nextProps.questions.data, this.state.currentZoom, this.state.minDist[this.state.currentZoom], nextProps.location)
      }
      this.state.map.setCenter(nextProps.location)
    }
  }

  componentDidUpdate () {
    if (this.state.map) this.state.map.panBy(250, 50)
  }

  render () {
    return (
      <div id='mapWindow'>
        <Segment basic>
          <div className='map-loader-position'>
            <div className='ld ld-ball ld-broadcast' style={{'font-size': '32px', color: '#23d9a1'}} /><div>Map Loading...</div>
          </div>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { location: state.currentLocation.location, questions: state.questions }
}

export default connect(mapStateToProps)(GMap)
