const express = require('express')
const path = require('path')
// const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '../public/')))
app.listen(port, () => console.log(`Listening on port: ${port}`))

module.exports = app
