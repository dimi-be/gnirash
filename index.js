const config = require('./infrastructure/config')
const logger = require('./infrastructure/logger')
const app = require('./infrastructure/server')

app.listen(config.port, () => {
  logger.info('gnirash listening on port 3000!')
})
