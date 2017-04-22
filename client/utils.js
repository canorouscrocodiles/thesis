var findCentroid = function (points) {
  var numCords = points.length
  var sumLats = 0
  var sumLongs = 0
  for (var i = 0; i < numCords; i++) {
    sumLats += points[i].coordinates.lat
    sumLongs += points[i].coordinates.lng
  }
  var avgLat = sumLats / numCords
  var avgLong = sumLongs / numCords
  return {lat: avgLat, lng: avgLong}
}

/*
Haversine formula implementation from https://rosettacode.org/wiki/Haversine_formula#JavaScript
Takes in 4 arguments, (latitude1, longitude1, latitude2, longitude2) and returns km
*/

// var haversine = function () {
//   var radians = Array.prototype.map.call(arguments, function (deg) { return deg / 180.0 * Math.PI })
//   var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3]
//   var R = 6372.8 // km
//   var dLat = lat2 - lat1
//   var dLon = lon2 - lon1
//   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
//   var c = 2 * Math.asin(Math.sqrt(a))
//   return R * c
// }

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6372.8
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km

  return d
}

class LinkedList {
  constructor () {
    this.head = null
    this.tail = null
  }

  addNode (val) {
    let node = {
      value: val,
      next: null,
      prev: null
    }
    if (this.head === null) {
      this.head = node
      this.tail = node
    } else {
      this.tail.next = node
      node.prev = this.tail
    }
    this.tail = node
  }

  removeNode (node) {
    if (node.prev !== null) {
      node.prev.next = node.next
    }
    if (node.next !== null) {
      node.next.prev = node.prev
    }
    if (this.head === node) {
      this.head = node.next
    }
    if (this.tail === node) {
      this.tail = node.prev
    }
  }
}

var arrayToListWithParse = function (array) {
  var list = new LinkedList()
  array.forEach(item => {
    item.coordinates = parseGeoJSON(item.st_asgeojson)
    list.addNode(item)
  })
  return list
}

var findFurthest = function (list, point) {
  var node = list.head
  var max = -1
  var furthest = null
  while (node !== null) {
    var dist = haversine(point.value.coordinates.lat, point.value.coordinates.lng, node.value.coordinates.lat, node.value.coordinates.lng)
    if (dist > max) {
      max = dist
      furthest = node
    }
    node = node.next
  }
  return furthest
}

var checkClosestCentroid = function (centroids, point, minDist) {
  var min = 402
  var closest = null
  centroids.forEach((centroid, i) => {
    var dist = haversine(point.value.coordinates.lat, point.value.coordinates.lng, centroid[0].coordinates.lat, centroid[0].coordinates.lng) * 1000
    if (dist <= minDist && dist < min) {
      min = dist
      closest = centroids[i]
    }
  })
  return closest
}

var clusterPoints = function (points, minDist, startPoint) {
  var centroids = []
  var currentPoint = {value: {coordinates: startPoint}} // Mock structure of other points
  // Create linked list from points, also parse st_asgeojson
  var list = arrayToListWithParse(points)
  // While list.head
  while (list.head !== null) {
    // Furthest point from currentPoint becomes currentPoint
    currentPoint = findFurthest(list, currentPoint)
    // Remove currentPoint from list
    if (currentPoint) {
      list.removeNode(currentPoint)
    }
    // Iterate through existing clusters
    // Check if currentPoint is within minDist, as well as which centroid has the smallest minDist
    var closest = checkClosestCentroid(centroids, currentPoint, minDist)
    // If so, push to sub-array
    // Else, push to centroids array
    closest ? closest.push(currentPoint.value) : centroids.push([currentPoint.value])
    // Go back to line 34
  }
  return centroids
}

var zoomRef = {
  16: {constant: 1.25, radius: 10},
  17: {constant: 1.25, radius: 7},
  18: {constant: 1.25, radius: 4},
  19: {constant: 1.25, radius: 3}
}

var defineRadius = function (num, constant, startingRadius) {
  return startingRadius * Math.pow(constant, num)
}

var transformClusterToPoints = function (clusters, zoomLevel) {
  return clusters.map(cluster => {
    var point = {}
    point.coordinates = findCentroid(cluster)
    point.radius = defineRadius(cluster.length, zoomRef[zoomLevel].constant, zoomRef[zoomLevel].radius)
    point.questions = cluster.map(single => {
      return {question: single.message, question_id: single.id}
    })
    return point
  })
}

var parseGeoJSON = function (location) {
  let geojson = JSON.parse(location)
  let coordinates = {
    lng: geojson.coordinates[0],
    lat: geojson.coordinates[1]
  }
  return coordinates
}

const randomPointMaker = (n, latMin, latMax, lngMin, lngMax) => {
  const results = []
  for (let i = 0; i < n; i++) {
    results.push({
      message: 'Test Message',
      coordinates: {
        lat: parseFloat(((Math.random() * (latMax - latMin)) + latMin).toFixed(6)),
        lng: parseFloat(((Math.random() * (lngMax - lngMin)) + lngMin).toFixed(6))
      }
    })
  }
  return results
}

module.exports = {
  haversine: haversine,
  findCentroid: findCentroid,
  clusterPoints: clusterPoints,
  transformClusterToPoints: transformClusterToPoints,
  parseGeoJSON: parseGeoJSON,
  randomPointMaker: randomPointMaker
}
