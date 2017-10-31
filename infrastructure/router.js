const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('./logger')
const render = require('./render')
const errorHandling = require('./errorhandling')
const authentication = require('./authentication')

module.exports = () => {
  const router = express.Router()
  errorHandling.configure(router)
  router.use(logger.middleware())
  router.use(render.middleware())
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(cookieParser())
  router.use(authentication.middleware())
  return router
}
