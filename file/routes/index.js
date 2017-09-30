const express = require('express')
const router = express.Router()
const logger = require('../../infrastructure/logger')

router.get('/', function (req, res) {
  logger.info('get list/')
  const list = require('./list')
  
  list().then((model) => {
    logger.info('list model', model)
    res.render('list', model)
  })
  .catch((err) => {
    res.status = 500
    res.send(err)
  })
})

module.exports = router
