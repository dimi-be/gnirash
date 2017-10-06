/* eslint-disable no-param-reassign */
const logger = require('./logger')
const authentication = require('./authentication')

function handleKnownErrors(error, req, res, next) {
  switch (error.message) {
    case authentication.errors.invalidCredentials:
      res.redirect(`/login?error=${error.message}`)
      break
    case authentication.errors.unauthenticated:
      res.redirect(`/login?error=${error.message}`)
      break
    default:
      next()
  }
}

const asyncMiddleware = fn =>
(req, res, next) => {
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
function configure(router) {
  const get = router.get
  const post = router.post

  router.get = (path, fn) => {
    get.call(router, path, asyncMiddleware(fn))
  }

  router.post = (path, fn) => {
    post.call(router, path, asyncMiddleware(fn))
  }
}

function middleware() {
  return (err, req, res, next) => {
    logger.error(err)

    if (err && err.message) {
      handleKnownErrors(err, req, res, next)
    } else {
      next(err)
    }
  }
}

module.exports = {
  configure,
  middleware,
}
