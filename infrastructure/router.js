const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const render = require('./render')
const errorHandling = require('./errorhandling')
const authentication = require('./authentication')
const logger = require('./logger')

module.exports = () => {
  const router = express.Router()
  errorHandling.configure(router)
  router.use(logger.middleware())
  router.use(render.middleware())
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(cookieParser())
  router.use(authentication.middleware())
  router.use(errorHandling.middleware())
  return router
}
