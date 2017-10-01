const fs = require('fs')
const logger = require('../../infrastructure/logger')
const File = require('../domain/file')
const FileType = require('../domain/filetype')

function getFileType(stats) {
  if (stats.isDirectory()) {
    return FileType.directory
  }

  if (stats.isFile()) {
    return FileType.directory
  }

  return FileType.unknown
}

function statFile(path, resolve, reject) {
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

module.exports = path =>
  new Promise((resolve, reject) => statFile(path, resolve, reject))
