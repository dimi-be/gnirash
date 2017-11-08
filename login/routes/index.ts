import * as Express from 'express'
import { routerFactory } from '../../infrastructure/server/routerfactory'
import * as authentication from '../../infrastructure/authentication'
import * as login from './login'

const router = routerFactory()

router.get('/?', async (req: Express.Request, res: Express.Response) => {
  const model = await login.get(req.query.message, req.claims)
  res.render('login', model)
})

router.post('/', async (req: Express.Request, res: Express.Response) => {
  if (req.body.action === 'logout') {
    authentication.logout(res, req)
    res.redirect('/login?message=loggedOut')
    return
  }

  const model = await login.post(req.body.key)
  await authentication.setSessionCookie(res, model.token)
  res.render('login', model)
})

export default router
