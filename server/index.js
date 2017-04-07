const express = require('express')
const path = require('path')
// const bodyParser = require('body-parser')
const app = express()

app.use(express.static(path.join(__dirname, '../public/')))
app.listen(8080, () => console.log('Listening on port 8080'))

module.exports = app
