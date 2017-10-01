const fs = require('fs')
const logger = require('../../infrastructure/logger')

function listDirectory(path, resolve, reject) {
  logger.debug(path)

  fs.readdir(path, (err, files) => {
    logger.debug(err, files)

    if (err) {
      logger.error(err)
      reject('Error while listing directory.')
      return
    }

    resolve(files)
  })
}

module.exports = path =>
  new Promise((resolve, reject) => listDirectory(path, resolve, reject))
