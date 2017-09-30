const fs = require('fs')
const path = require('path')
const logger = require('../../infrastructure/logger')

function listDirectory(resolve, reject) {
  const currentDirPath = __dirname
  const listDirPath = path.join(currentDirPath, '/../../test-folder')

  logger.info(`listDirPath=${listDirPath}`)

  fs.readdir(listDirPath, (err, files) => {
    logger.info('readdir callback', err, files)

    if (err) {
      logger.error(err)
      reject('Error while listing directory.')
    }

    resolve(files)
  })
}

module.exports = () => new Promise(listDirectory)
