const express = require('express')
const config = require('../config')
const logger = require('../infrastructure/logger')
const filesRoutes = require('../files/routes')

logger.info('Setting up express')

const app = express()

const locals = {
  siteTitle: config.siteTitle,
}

Object.assign(app.locals, locals)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

logger.info('Adding routes')
app.use('/files', filesRoutes)

logger.info('Adding middleware')
logger.configure(app)

module.exports = app
