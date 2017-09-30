const express = require('express')
const logger = require('../../infrastructure/logger')
const list = require('./list')

const router = express.Router()

router.get('/', (req, res) => {
  logger.info('get list/')

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
