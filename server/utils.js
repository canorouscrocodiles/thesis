/*
Haversine formula implementation from https://rosettacode.org/wiki/Haversine_formula#JavaScript
Takes in 4 arguments, (latitude1, longitude1, latitude2, longitude2) and returns km
*/

var haversine = function () {
  var radians = Array.prototype.map.call(arguments, function (deg) { return deg / 180.0 * Math.PI })
  var lat1 = radians[0]
  var lon1 = radians[1]
  var lat2 = radians[2]
  var lon2 = radians[3]
  var R = 6372.8 // in km
  var dLat = lat2 - lat1
  var dLon = lon2 - lon1
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.asin(Math.sqrt(a))
  return R * c
}







module.exports = 'hello'