const router = require('../../infrastructure/router')()
const authentication = require('../../infrastructure/authentication')
const login = require('./login')

router.get('/?', async (req, res) => {
  const model = await login.get(req.query.error, req.claims)
  res.render('login', model)
})

router.post('/', async (req, res) => {
  const model = await login.post(req.body.key)
  await authentication.setSessionCookie(res, model.token)
  res.render('login', model)
})

module.exports = router
