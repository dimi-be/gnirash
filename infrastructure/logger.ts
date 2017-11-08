import errorStackParser = require('error-stack-parser')
import * as winston from 'winston'
const config = require('./config')

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
  private logger: winston.LoggerInstance

  constructor() {
    const transports = []

    config.logging.forEach((t) => {
      if (t.name === 'console') {
        transports.push(new (winston.transports.Console)({
          timestamp: true,
          colorize: 'all',
          level: t.level,
        }))
      } else if (t.name === 'file') {
        transports.push(new (winston.transports.File)({
          filename: t.file,
          level: t.level,
        }))
      }
    })

    this.logger = new (winston.Logger)({
      transports,
      levels,
      level: 'info',
    })

    winston.addColors(colors)
  }

  public middleware() {
    return (request, response, next) => this.logRequest(request, response, next)
  }

  public debug(...args) {
    this.log('debug', ...args)
  }

  public info(...args) {
    this.log('info', ...args)
  }

  public warning(...args) {
    this.log('warning', ...args)
  }

  public error(...args) {
    this.log('error', ...args)
  }

  private log(level, ...args) {
    this.logger.log(level, this.getPrefix(), ...args)
  }

  private logRequest(request, response, next) {
    this.logger.log('info', request.method, request.originalUrl)
    next()
  }

  private logRequestError(error, request, response, next) {
    this.logger.log('error', error)
    next(error)
  }

  private getCallerInfo() {
    try {
      const error = new Error()
      const stack = errorStackParser.parse(error)
      const callerInfo = stack[4]

      return `${callerInfo.fileName}:${callerInfo.lineNumber}:${callerInfo.functionName}`
    } catch (e) {
      this.logger.log('error', e)
      return ''
    }
  }

  private getPrefix() {
    const callerInfo = this.getCallerInfo()
    return `${callerInfo}():`
  }
}

export const logger = new Logger()
