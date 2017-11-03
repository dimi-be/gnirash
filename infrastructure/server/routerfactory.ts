import * as Express from 'express'
import * as bodyParser from 'body-parser'
import cookieParser = require('cookie-parser')
import logger = require('../logger')
import render = require('../render')
import errorHandling = require('../errorhandling')
import authentication = require('../authentication')

export function routerFactory (): Express.Router {
  const router = Express.Router()
  errorHandling.configure(router)
  router.use(logger.middleware())
  router.use(render.middleware())
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(cookieParser())
  router.use(authentication.middleware())
  return router
}
