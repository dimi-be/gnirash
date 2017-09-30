const express = require('express')
const render = require('./render')

module.exports = () => {
  const router = express.Router()
  render.configure(router)
  return router
}
