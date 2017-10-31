const fs = require('fs')
const path = require('path')
const https = require('https')
const express = require('express')
const config = require('./config')
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
    res.redirect('/files')
  })

  app.use('/files', filesRoutes)
  app.use('/login', loginRoutes)
}

function addStaticRoutes(app) {
  logger.info('Adding static routes')
  const themesPath = path.join(config.programRoot, 'themes')
  app.use('/themes', express.static(themesPath))
}

function addMiddleware(app) {
  logger.info('Adding middleware')
  app.use(logger.middleware())
  app.use(errorHandling.middleware())
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

module.exports = {
  start: () =>
    new Promise((resolve, reject) => {
      const app = setup()

      if (config.protocol === 'http') {
        app.listen(config.port, () => {
          resolve([config.protocol, config.port])
        })
      } else if (config.protocol === 'https') {
        const options = {
          cert: fs.readFileSync(config.https.cert),
          key: fs.readFileSync(config.https.key),
        }

        https.createServer(options, app)
          .listen(config.port, () => {
            resolve([config.protocol, config.port])
          })
      } else {
        reject(new Error(`Unkown protocol: ${config.protocol}`))
      }
    }),
}
