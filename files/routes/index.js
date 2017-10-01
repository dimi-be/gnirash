const router = require('../../infrastructure/router')()
const list = require('./get')

router.get('/:subDir?', (req, res, next) => {
  list(req.params.subDir).then((model) => {
    res.render('get', model)
  })
  .catch(next)
})

module.exports = router
