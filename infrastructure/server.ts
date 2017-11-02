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
  public protocol: string
  public port: number

  public start(): Promise<Server> {
    return new Promise((resolve, reject) => {
      const app = this._setup()
      this.protocol = config.protocol
      this.port = config.port

      if (this.protocol === 'http') {
        app.listen(this.port, () => {
          resolve(this)
        })
      } else if (this.protocol === 'https') {
        const options = {
          cert: fs.readFileSync(config.https.cert),
          key: fs.readFileSync(config.https.key),
        }
        https.createServer(options, app)
          .listen(this.port, () => {
            resolve(this)
          })
      } else {
        reject(new Error(`Unkown protocol: ${this.protocol}`))
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

  private _addLocals(app: express.Application) {
    logger.info('Adding locals')

    const locals = {
      siteTitle: config.siteTitle,
    }

    Object.assign(app.locals, locals)
  }

  private _addRoutes(app: express.Application) {
    logger.info('Adding routes')

    app.get('/', (req, res) => {
      res.redirect('/files')
    })

    app.use('/files', filesRoutes)
    app.use('/login', loginRoutes)
  }

  private _addStaticRoutes(app: express.Application) {
    logger.info('Adding static routes')
    const themesPath = path.join(config.programRoot, 'themes')
    app.use('/themes', express.static(themesPath))
  }

  private _addMiddleware(app: express.Application) {
    logger.info('Adding middleware')
    app.use(logger.middleware())
    app.use(errorHandling.middleware())
  }

}

export default new Server()
