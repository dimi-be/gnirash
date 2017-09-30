const express = require('express')
const logger = require('./infrastructure/logger')

const fileRoutes = require('./file/routes')

const app = express()
app.set('view engine', 'pug')
app.set('views', __dirname + '/file/routes/')

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use('/list', fileRoutes)

app.listen(3000, function () {
  logger.info('Example app listening on port 3000!')
})
