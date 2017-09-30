const express = require('express')
const render = require('./render')
const logger = require('./logger')

module.exports = () => {
  const router = express.Router()
  render.configure(router)
  logger.configure(router)
  return router
}
