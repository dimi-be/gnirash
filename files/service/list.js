const fs = require('fs')
const path = require('path')
const logger = require('../../infrastructure/logger')
const stat = require('./stat')

function listDirectory(directory, resolve, reject) {
  fs.readdir(directory.path, (err, files) => {
    logger.debug(err, files)

    if (err) {
      logger.error(err)
      reject('Error while listing directory.')
      return
    }

    const filePaths = files.map(x => path.join(directory.path, x))
    const stats = filePaths.map(x => stat(x))

    Promise
      .all(stats)
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Returns a list of files and directories in the given directory
 *
 * @param {File} directory
 * @returns {Promise.<File[]>}
 */
function list(directory) {
  return new Promise((resolve, reject) => {
    listDirectory(directory, resolve, reject)
  })
}

module.exports = list
