const fs = require('fs')
const logger = require('../../infrastructure/logger')
const File = require('../domain/file')
const FileType = require('../domain/filetype')

function getFileType(stats) {
  if (stats.isDirectory()) {
    return FileType.directory
  }

  if (stats.isFile()) {
    return FileType.file
  }

  return FileType.unknown
}

function getStat(path, resolve, reject) {
  logger.debug(path)

  fs.stat(path, (error, stats) => {
    if (error) {
      logger.error(error)
      reject(error)
      return
    }

    const fileType = getFileType(stats)

    if (fileType === FileType.unknown) {
      logger.error('unkown file type', stats)
      reject('unkown file type')
      return
    }

    const file = new File(path, fileType)
    resolve(file)
  })
}

/**
 * Get a file based on the absolute (real) path given
 *
 * @param {string} absolutePath
 * @return {Promise.<File>}
 */
function stat(absolutePath) {
  return new Promise((resolve, reject) =>
      getStat(absolutePath, resolve, reject))
}

module.exports = stat
