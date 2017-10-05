const router = require('../../infrastructure/router')()
const authentication = require('../../infrastructure/authentication')

router.get('/?', async (req, res) => {
  res.render('login')
})

router.post('/', async (req, res) => {
  try {
    await authentication.authenticate(req.body.key, res)
    res.render('login')
  } catch (e) {
    if (e.message === authentication.errors.invalidCredentials) {
      res.redirect(`/login?error=${e.message}`)
    } else {
      throw e
    }
  }
})

module.exports = router
