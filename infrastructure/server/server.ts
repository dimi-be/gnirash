import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as https from 'https'

import config = require('../config')
import { logger } from '../logger'
import { errorHandling } from '../errorhandling'
import { filesRoutes } from '../../files/routes'
import { loginRoutes } from '../../login/routes'

class Server {
  public protocol: string
  public port: number

  public start(): Promise<Server> {
    return new Promise((resolve, reject) => {
      const app = this.setup()
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

  private setup() {
    logger.info('Setting up express')

    const app = express()
    this.addLocals(app)
    this.addRoutes(app)
    this.addStaticRoutes(app)
    this.addMiddleware(app)

    return app
  }

  private addLocals(app: express.Application) {
    logger.info('Adding locals')

    const locals = {
      siteTitle: config.siteTitle,
    }

    Object.assign(app.locals, locals)
  }

  private addRoutes(app: express.Application) {
    logger.info('Adding routes')

    app.get('/', (req, res) => {
      res.redirect('/files')
    })

    app.use('/files', filesRoutes)
    app.use('/login', loginRoutes)
  }

  private addStaticRoutes(app: express.Application) {
    logger.info('Adding static routes')
    const themesPath = path.join(config.programRoot, 'themes')
    app.use('/themes', express.static(themesPath))
  }

  private addMiddleware(app: express.Application) {
    logger.info('Adding middleware')
    app.use(logger.middleware())
    app.use(errorHandling.middleware())
  }
}

export const server = new Server()
