const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')

function authenticateRequest(req, res, next) {

}

function configure(app) {

}

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

  res.cookie('jwt', token)
}

module.exports = {
  configure,
  authenticate,
}
