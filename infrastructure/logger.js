const errorStackParser = require('error-stack-parser')
const dateTime = require('date-time')
const winston = require('winston')

const levels = {
  error: 0,
  warning: 1,
  info: 2,
  debug: 3,
}

const colors = {
  error: 'red',
  warning: 'yellow',
  info: 'white',
  debug: 'grey',
}

class Logger {
  constructor() {
    this._logger = new (winston.Logger)({
      levels,
      transports: [
        new (winston.transports.Console)({
          timestamp: true,
          colorize: true,
        }),
      ],
    })

    winston.addColors(colors)
    this._logger.level = 'debug'
  }

  middleware() {
    return (...args) => this._logRequest(...args)
  }

  debug(...args) {
    this._logger.log('debug', ...args)
    // console.debug('D', this._getPrefix(), ...args)
  }

  info(...args) {
    this._logger.log('info', args[0])
    // console.info('I', this._getPrefix(), ...args)
  }

  warning(...args) {
    this._logger.log('warning', ...args)
    // console.warn('W', this._getPrefix(), ...args)
  }

  error(...args) {
    this._logger.log('error', ...args)
    // console.error('E', this._getPrefix(), ...args)
  }

  _logRequest(request, response, next) {
    this.info(request.method, request.originalUrl)
    next()
  }

  _logRequestError(error, request, response, next) {
    this.error(error)
    next(error)
  }

  /* eslint-disable class-methods-use-this  */
  _getCallerInfo() {
    try {
      const error = new Error()
      const stack = errorStackParser.parse(error)
      const callerInfo = stack[3]

      return `${callerInfo.fileName}:${callerInfo.lineNumber}:${callerInfo.functionName}`
    } catch (e) {
      this._logger.log('error', e)
      return ''
    }
  }

  _getPrefix() {
    const dateTimeString = dateTime()
    const callerInfo = this._getCallerInfo()
    return `${dateTimeString} ${callerInfo}():`
  }
}

module.exports = new Logger()
