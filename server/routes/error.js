const errorHandler = function (error, res, code) {
  console.log(`Error: ${error}`)
  res.sendStatus(code)
}

module.exports = errorHandler
