const express = require('express')
const path = require('path')
const logger = require('./infrastructure/logger')
const fileRoutes = require('./file/routes')

const app = express()
const viewsDir = path.join(__dirname, '/file/routes/')
logger.info('__dirname=', __dirname)
logger.info('viewsDir=', viewsDir)

app.set('view engine', 'pug')
app.set('views', viewsDir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/list', fileRoutes)

app.listen(3000, () => {
  logger.info('Example app listening on port 3000!')
})
