const crypto = require('crypto')
const jwt = require('jsonwebtoken')

import * as errors from './errors'
import { Claims } from './claims'

const config = require('../config')
const logger = require('../logger')

export { errors, Claims }

export async function setSessionCookie(res, token) {
  res.cookie('jwt', token, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })
}

export async function logout(res, req) {
  res.clearCookie('jwt')
  req.claims = { loggedIn: false }
}

function getKeyFromHash(keyHash) {
  const createHash = crypto.createHash('sha256')
  const user = config.users
    .filter(x => keyHash === createHash.update(x.key).digest('hex'))[0]
  return user.key
}

async function authenticateRequest(req, res, next): Promise<void> {
  try {
    const token = req.cookies.jwt
    const claims = jwt.verify(token, config.secret)

    // After the user is verified we authenticate him again because
    // sessions last 1 year, so maybe the user was removed or modified.
    const key = getKeyFromHash(claims.keyHash)
    const newToken = await authenticate(key)
    const newClaims = jwt.verify(newToken, config.secret)
    req.claims = newClaims
    await setSessionCookie(res, newToken)
    next()
  } catch (e) {
    if (e.message === 'jwt must be provided') {
      logger.warning('User not authenticated')

      if (req.baseUrl !== '/login') {
        logout(res, req)
        next(new Error(errors.unauthenticated))
      } else {
        next()
      }
    } else {
      logger.error(e)
      throw e
    }
  }
}

export function middleware() {
  return authenticateRequest
}

export async function authenticate(key) {
  const user = config.users
    .filter(u => u.key === key)[0]

  if (!user) {
    logger.warning(errors.invalidCredentials, key)
    throw new Error(errors.invalidCredentials)
  }

  const keyHash = crypto.createHash('sha256')
    .update(user.key)
    .digest('hex')

  const claims = new Claims(
    keyHash,
    user.name,
    true,
    '1 year')

  const token = jwt.sign(claims, config.secret)

  logger.info('User authenticated', claims.name)
  return token
}
