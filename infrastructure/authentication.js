const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require('./logger')

const errors = {
  invalidCredentials: 'invalidCredentials',
  unauthenticated: 'unauthenticated',
}

async function authenticate(key, res) {
  const user = config.users
    .filter(u => u.key === key)[0]

  if (!user) {
    logger.warning(errors.invalidCredentials, key)
    throw new Error(errors.invalidCredentials)
  }

  const keyHash = crypto.createHash('sha256')
    .update(user.key)
    .digest('hex')

  const claims = {
    name: user.name,
    keyHash,
    expiresIn: '1 year',
  }

  const token = jwt.sign(claims, config.secret)

  res.cookie('jwt', token, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })

  logger.info('User authenticated', claims.name)
  return token
}

function getKeyFromHash(keyHash) {
  const createHash = crypto.createHash('sha256')
  const user = config.users
    .filter(x => keyHash === createHash.update(x.key).digest('hex'))[0]
  return user.key
}

async function authenticateRequest(req, res, next) {
  try {
    const token = req.cookies.jwt
    const claims = jwt.verify(token, config.secret)

    // After the user is verified we authenticate him again because
    // sessions last 1 year, so maybe the user was removed or modified.
    const key = getKeyFromHash(claims.keyHash)
    const newToken = await authenticate(key, res)
    const newClaims = jwt.verify(newToken, config.secret)
    req.claims = newClaims
    next()
  } catch (e) {
    logger.debug(e)
    logger.warning('User not authenticated')

    if (req.baseUrl !== '/login') {
      res.clearCookie('jwt')
      next(new Error(errors.unauthenticated))
    } else {
      next()
    }
  }
}

function middleware() {
  return authenticateRequest
}

module.exports = {
  middleware,
  authenticate,
  errors,
}
