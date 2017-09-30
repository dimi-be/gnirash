const logger = require('./infrastructure/logger')
const app = require('./infrastructure/server')

app.listen(3000, () => {
  logger.info('gnirash listening on port 3000!')
})
