const router = require('../../infrastructure/router')()
const authentication = require('../../infrastructure/authentication')

router.get('/?', async (req, res) => {
  res.render('login')
})

router.post('/', async (req, res) => {
  authentication.authenticate(req.body.key, res)
  res.render('login')
})

module.exports = router
