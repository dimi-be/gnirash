const express = require('express')
const logger = require('../infrastructure/logger')
const filesRoutes = require('../files/routes')
const render = require('./render')

logger.info('Setting up express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

logger.info('Adding routes')
app.use('/files', filesRoutes)

logger.info('Adding middleware')
render.configure(app)
logger.configure(app)

module.exports = app
