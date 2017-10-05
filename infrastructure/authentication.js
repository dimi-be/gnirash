const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require('./logger')

async function authenticate(key, res) {
  const user = config.users
    .filter(u => u.key === key)[0]

  if (!user) {
    throw new Error('User not found')
  }

  const keyHash = crypto.createHash('sha256')
    .update(user.key)
    .digest('hex')

  const claims = {
    name: user.name,
    keyHash,
    exp: Math.floor(Date.now() / 1000) + (15 * 60),
  }

  const token = jwt.sign(claims, config.secret)

  res.cookie('jwt', token, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })

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
    if (req.cookies.jwt) {
      res.clearCookie('jwt')
    }

    if (req.baseUrl === '/login') {
      logger.warning('User not authenticated')
      next()
    } else {
      logger.error(e)
      next(e)
    }
  }
}

function middleware() {
  return authenticateRequest
}

module.exports = {
  middleware,
  authenticate,
}
