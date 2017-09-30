const logger = require('../../infrastructure/logger')
const router = require('../../infrastructure/router')()
const list = require('./list')

router.get('/', (req, res) => {
  list().then((model) => {
    res.render('list', model)
  })
  .catch((err) => {
    res.status = 500
    res.send(err)
  })
})

router.get('/list', (req, res) => {
  logger.info('get list/')

  list().then((model) => {
    res.render(model)
  })
  .catch((err) => {
    res.status = 500
    res.send(err)
  })
})

module.exports = router
