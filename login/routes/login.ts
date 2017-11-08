import { Claims } from '../../infrastructure/authentication'
const authentication = require('../../infrastructure/authentication')

class LoginModel {
  public token: string
  public loggedIn: boolean
  public infoMessage: string
  public errorMessage: string

  constructor(token: string, loggedIn: boolean, infoMessage: string, errorMessage: string = '') {
    this.token = token
    this.loggedIn = loggedIn
    this.infoMessage = infoMessage
    this.errorMessage = errorMessage
  }
}

function getMessageFromError(error: string): string {
  if (error === authentication.errors.invalidCredentials) {
    return 'Your is key invalid!'
  }

  if (error === authentication.errors.unauthenticated) {
    return 'Please login to access this site.'
  }

  return 'An error occured'
}

export async function post(key: string): Promise<LoginModel> {
  const token = await authentication.authenticate(key)

  return new LoginModel(
    token,
    true,
    'You have been successfully logged in!',
  )
}

export async function get(message: string, claims: Claims): Promise<LoginModel> {
  const token = undefined
  const loggedIn = claims ? claims.loggedIn : false
  let infoMessage = ''
  let errorMessage = ''

  if (loggedIn && !message) {
    infoMessage = `You are already logged in as ${claims.name}`
  } else if (!loggedIn && !message) {
    infoMessage = getMessageFromError(authentication.errors.unauthenticated)
  } else if (message && message === 'loggedOut') {
    infoMessage = 'You have succesfully logged out.'
  } else {
    errorMessage = getMessageFromError(message)
  }

  return new LoginModel(
    token,
    loggedIn,
    infoMessage,
    errorMessage,
  )
}
