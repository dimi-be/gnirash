const errorStackParser = require('error-stack-parser')
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
  debug: 'blue',
}

class Logger {
  constructor() {
    this._logger = new (winston.Logger)({
      levels,
      level: 'info',
      transports: [
        new (winston.transports.Console)({
          timestamp: true,
          colorize: 'all',
        }),
      ],
    })

    winston.addColors(colors)
  }

  middleware() {
    return (...args) => this._logRequest(...args)
  }

  debug(...args) {
    this._log('debug', ...args)
  }

  info(...args) {
    this._log('info', ...args)
  }

  warning(...args) {
    this._log('warning', ...args)
  }

  error(...args) {
    this._log('error', ...args)
  }

  _log(level, ...args) {
    this._logger.log(level, this._getPrefix(), ...args)
  }

  _logRequest(request, response, next) {
    this._logger.log('info', request.method, request.originalUrl)
    next()
  }

  _logRequestError(error, request, response, next) {
    this.logger.log('error', error)
    next(error)
  }

  _getCallerInfo() {
    try {
      const error = new Error()
      const stack = errorStackParser.parse(error)
      const callerInfo = stack[4]

      return `${callerInfo.fileName}:${callerInfo.lineNumber}:${callerInfo.functionName}`
    } catch (e) {
      this._logger.log('error', e)
      return ''
    }
  }

  _getPrefix() {
    const callerInfo = this._getCallerInfo()
    return `${callerInfo}():`
  }
}

module.exports = new Logger()
