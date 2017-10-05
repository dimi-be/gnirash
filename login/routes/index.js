const router = require('../../infrastructure/router')()

router.get('/', async (req, res) => {
  res.render('login')
})

module.exports = router
