import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as https from 'https'

import config = require('./config')
import logger = require('./logger')
import errorHandling = require('./errorhandling')
import filesRoutes = require('../files/routes')
import loginRoutes = require('../login/routes')

class Server {
  public start() {
    return new Promise((resolve, reject) => {
      const app = this._setup()
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
    })
  }

  private _setup() {
    logger.info('Setting up express')

    const app = express()
    this._addLocals(app)
    this._addRoutes(app)
    this._addStaticRoutes(app)
    this._addMiddleware(app)

    return app
  }

  private _addLocals(app) {
    logger.info('Adding locals')

    const locals = {
      siteTitle: config.siteTitle,
    }

    Object.assign(app.locals, locals)
  }

  private _addRoutes(app) {
    logger.info('Adding routes')

    app.get('/', (req, res) => {
      res.redirect('/files')
    })

    app.use('/files', filesRoutes)
    app.use('/login', loginRoutes)
  }

  private _addStaticRoutes(app) {
    logger.info('Adding static routes')
    const themesPath = path.join(config.programRoot, 'themes')
    app.use('/themes', express.static(themesPath))
  }

  private _addMiddleware(app) {
    logger.info('Adding middleware')
    app.use(logger.middleware())
    app.use(errorHandling.middleware())
  }

}

export default new Server()
