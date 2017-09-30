const router = require('../../infrastructure/router')()
const list = require('./list')

router.get('/:subDir?', (req, res, next) => {
  list(req.params.subDir).then((model) => {
    res.render('list', model)
  })
  .catch(next)
})

module.exports = router
