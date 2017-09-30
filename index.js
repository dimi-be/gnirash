const express = require('express')
const logger = require('./infrastructure/logger')
const filesRoutes = require('./files/routes')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/files', filesRoutes)

app.listen(3000, () => {
  logger.info('Example app listening on port 3000!')
})
