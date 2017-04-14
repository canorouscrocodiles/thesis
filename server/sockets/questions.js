const enterRoom = (action, socket) => {
  // verify user, emit error if not valid or does not exists
    // EMIT TO USER ONLY or DO NOT do THIS?
  // verify question with id exists, if not emit error?
  //  upon success, place user into question room
  // if error, emit error to user?
  socket.join(action.data.id)
}

const leaveRoom = (action, socket) => socket.leave(action.data.id)

const insertQuestion = (action, socket) => {
  // verify user
  // insert question into DB
  // create room and put user into their own room
  // emit question to all users within radius?
}

const updateQuestion = (action, socket) => {
  //  verify user
  //  update question in DB
  //  emit update to all users
}

module.exports = {
  enterRoom: enterRoom,
  leaveRoom: leaveRoom,
  insertQuestion: insertQuestion,
  updateQuestion: updateQuestion
}
