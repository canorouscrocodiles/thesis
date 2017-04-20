const io = require('../index').io
const Location = require('../db/models/location')
const Questions = require('../db/models/questions')
const UPDATED_QUESTIONS_SUCCESS = 'UPDATED_QUESTIONS_SUCCESS'
const UPDATED_QUESTIONS_FAILURE = 'UPDATED_QUESTIONS_FAILURE'

const updateLocation = (socket, {user_id, coordinates}) => {
  Location.updateLocation(socket.id, user_id, coordinates)
  .then(() => Questions.selectQuestions(coordinates))
  .then((questions) => {
    io.to(socket.id).emit('action', { type: UPDATED_QUESTIONS_SUCCESS, data: questions, location: coordinates })
  })
  .catch(error => {
    console.log(`Error updating location or selecting nearby questions. Error: ${error}`)
    io.to(socket.id).emit('action', { type: UPDATED_QUESTIONS_FAILURE, data: error })
  })
}

const deleteLocation = (id) => {
  Location.deleteLocation(id)
  .then(() => {
    console.log(`Successfully deleted socket with id ${id}`)
  })
  .catch(error => {
    console.log(`Error deleting: ${error}`)
  })
}

module.exports = {
  updateLocation: updateLocation,
  deleteLocation: deleteLocation
}
