const logger = require('../../infrastructure/logger')
const router = require('../../infrastructure/router')()
const list = require('./list')

router.get('/list', (req, res) => {
  logger.info('get list/')

  list().then((model) => {
    logger.info('list model', model)
    res.render(model)
  })
  .catch((err) => {
    res.status = 500
    res.send(err)
  })
})

module.exports = router
