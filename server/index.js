const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const router = require('./router')
const app = express()

const port = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public/')))
app.use('/api', router)

app.listen(port, () => console.log(`Listening on port: ${port}`))

module.exports = app
