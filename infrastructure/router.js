const express = require('express')
const render = require('./render')
const errorHandling = require('./errorhandling')
const bodyParser = require('body-parser')

module.exports = () => {
  const router = express.Router()
  router.use(bodyParser.urlencoded({ extended: false }))
  errorHandling.configure(router)
  render.configure(router)
  return router
}
