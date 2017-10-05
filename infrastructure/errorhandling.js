/* eslint-disable no-param-reassign */
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
  return (err, req, res, n) => {
    this._logRequestError(err, req, res, n)
  }
}

module.exports = {
  configure,
  middleware,
}
