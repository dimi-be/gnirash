/* eslint-disable no-console */
const errorStackParser = require('error-stack-parser')
const dateTime = require('date-time')

class Logger {
  configure(router) {
    router.use((...args) => this._middleware(...args))
  }

  debug(...args) {
    console.debug('D', this._getPrefix(), ...args)
  }

  info(...args) {
    console.log('I', this._getPrefix(), ...args)
  }

  error(...args) {
    console.error('E', this._getPrefix(), ...args)
  }

  _middleware(request, response, next) {
    this.info(request.method, request.originalUrl)
    next()
  }

  /* eslint-disable class-methods-use-this  */
  _getCallerInfo() {
    try {
      const error = new Error()
      const stack = errorStackParser.parse(error)
      const callerInfo = stack[3]

      return `${callerInfo.fileName}:${callerInfo.lineNumber}:${callerInfo.functionName}`
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  _getPrefix() {
    const dateTimeString = dateTime()
    const callerInfo = this._getCallerInfo()
    return `${dateTimeString} ${callerInfo}`
  }
}

module.exports = new Logger()
