import * as Express from 'express'
import { logger } from './logger'
import { errors } from './authentication'

function handleKnownErrors(
    error: Error,
    req: Express.Request,
    res: Express.Response,
    next: Function) {
  switch (error.message) {
    case errors.invalidCredentials:
      res.redirect(`/login?message=${error.message}`)
      break
    case errors.unauthenticated:
      res.redirect(`/login?message=${error.message}`)
      break
    default:
      next()
  }
}

const asyncMiddleware = fn => (req: Express.Request, res: Express.Response, next: Function) => {
  Promise.resolve(fn(req, res, next))
    .catch((...args) => {
      next(...args)
    })
}

/**
 * Replace the default impelmentation of get, post, ...
 * with our custom one that does error handling
 *
 * @param {*} router
 */
function configure(router: Express.Router) {
  const { get, post } = router

  router.get = (path, fn) => {
    return get.call(router, path, asyncMiddleware(fn))
  }

  router.post = (path, fn) => {
    return post.call(router, path, asyncMiddleware(fn))
  }
}

function middleware() {
  return (err: Error, req: Express.Request, res: Express.Response, next: (e: Error) => any) => {
    logger.error(err)

    if (err && err.message) {
      handleKnownErrors(err, req, res, next)
    } else {
      next(err)
    }
  }
}

export const errorHandling = {
  configure,
  middleware,
}
