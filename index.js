const logger = require('./infrastructure/logger')
const server = require('./infrastructure/server')

server.start().then(([protocol, port]) => {
  logger.info(`gnirash listening on ${protocol}://*:${port}!`)
})
