import logger = require('./infrastructure/logger')
import server = require('./infrastructure/server')

server.start().then(([protocol, port]) => {
  logger.info(`gnirash listening on ${protocol}://*:${port}!`)
})
