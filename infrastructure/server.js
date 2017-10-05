const path = require('path')
const express = require('express')
const config = require('../config')
const logger = require('../infrastructure/logger')
const filesRoutes = require('../files/routes')
const loginRoutes = require('../login/routes')

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
app.use('/login', loginRoutes)

logger.info('Adding middleware')
logger.configure(app)

logger.info('Adding static files')
const themesPath = path.join(__dirname, '..', 'themes')
app.use('/themes', express.static(themesPath))

module.exports = app
