var transformUnread = function (answers) {
  var transformed = {}
  var transformedArray = []
  var count = 0
  answers.forEach(function (answer) {
    if (transformed[answer.id]) {
      transformed[answer.id].answers.push(answer.answer_message)
      count++
    } else {
      transformed[answer.id] = {
        id: answer.id,
        question: answer.question_message,
        answers: [answer.answer_message]
      }
      count++
    }
  })
  transformedArray.push(count)
  for (var key in transformed) {
    transformedArray.push(transformed[key])
  }
  return transformedArray
}

module.exports = {
  transformUnread: transformUnread
}
