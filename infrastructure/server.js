const path = require('path')
const express = require('express')
const config = require('../config')
const logger = require('./logger')
const errorHandling = require('./errorhandling')
const filesRoutes = require('../files/routes')
const loginRoutes = require('../login/routes')

function addLocals(app) {
  logger.info('Adding locals')

  const locals = {
    siteTitle: config.siteTitle,
  }

  Object.assign(app.locals, locals)
}

function addRoutes(app) {
  logger.info('Adding routes')

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use('/files', filesRoutes)
  app.use('/login', loginRoutes)
}

function addStaticRoutes(app) {
  logger.info('Adding static routes')
  const themesPath = path.join(__dirname, '..', 'themes')
  app.use('/themes', express.static(themesPath))
}

function addMiddleware(app) {
  logger.info('Adding middleware')
  app.use(logger.middleware)
  app.use(errorHandling.middleware)
}

function setup() {
  logger.info('Setting up express')

  const app = express()
  addLocals(app)
  addRoutes(app)
  addStaticRoutes(app)
  addMiddleware(app)

  return app
}

module.exports = setup()
