import { server } from './infrastructure/server/server'
import { logger } from './infrastructure/logger'

logger.info(`NODE_ENV = ${process.env.NODE_ENV}`)

server.start().then(({ protocol, port }) => {
  logger.info(`gnirash listening on ${protocol}://*:${port}!`)
})
