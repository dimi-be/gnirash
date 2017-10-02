/* eslint-disable no-param-reassign */

const asyncMiddleware = fn =>
(req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next)
}

/**
 * Replace the default impelmentation of get, post, ...
 * with our custom one that does error handling
 *
 * @param {*} router
 */
function configure(router) {
  const get = router.get

  router.get = (path, fn) => {
    get.call(router, path, asyncMiddleware(fn))
  }
}

module.exports = {
  configure,
}
