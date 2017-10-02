const express = require('express')
const render = require('./render')
const errorHandling = require('./errorhandling')

module.exports = () => {
  const router = express.Router()
  errorHandling.configure(router)
  render.configure(router)
  return router
}
