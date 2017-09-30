const fs = require('fs')
const path = require('path')
const logger = require('../../infrastructure/logger')

function listDirectory(subDir, resolve, reject) {
  logger.debug(subDir)

  const currentDirPath = __dirname
  const listDirPath = subDir
    ? path.join(currentDirPath, '/../../test-folder', subDir)
    : path.join(currentDirPath, '/../../test-folder')

  logger.debug(`listDirPath=${listDirPath}`)

  fs.readdir(listDirPath, (err, files) => {
    logger.debug(err, files)

    if (err) {
      logger.error(err)
      reject('Error while listing directory.')
      return
    }

    resolve(files)
  })
}

module.exports = (subDir = undefined) =>
  new Promise((resolve, reject) => listDirectory(subDir, resolve, reject))
