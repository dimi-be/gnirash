const authentication = require('../../infrastructure/authentication')

class LoginModel {
  constructor(token, loggedIn, infoMessage, errorMessage) {
    this.token = token
    this.loggedIn = loggedIn
    this.infoMessage = infoMessage
    this.errorMessage = errorMessage
  }
}

function getMessageFromError(error) {
  if (error === authentication.errors.invalidCredentials) {
    return 'Your is key invalid!'
  }

  if (error === authentication.errors.unauthenticated) {
    return 'Please login to access this site.'
  }

  return 'An error occured'
}

async function post(key) {
  const token = await authentication.authenticate(key)

  return new LoginModel(
    token,
    true,
    'You have been successfully logged in!',
  )
}

async function get(error, claims) {
  const token = undefined
  const loggedIn = claims ? claims.loggedIn : false
  let infoMessage = ''
  let errorMessage = ''

  if (loggedIn && !error) {
    infoMessage = `You are already logged in as ${claims.name}`
  } else if (!loggedIn && !error) {
    infoMessage = getMessageFromError(authentication.errors.unauthenticated)
  } else {
    errorMessage = getMessageFromError(error)
  }

  return new LoginModel(
    token,
    loggedIn,
    infoMessage,
    errorMessage,
  )
}

module.exports = {
  post,
  get,
}
