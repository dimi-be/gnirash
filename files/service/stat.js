const fs = require('fs')
const util = require('util')
const logger = require('../../infrastructure/logger')
const File = require('../domain/file')
const FileType = require('../domain/filetype')
const getVirtualPath = require('../service/getvirtualpath')

function getFileType(stats) {
  if (stats.isDirectory()) {
    return FileType.directory
  }

  if (stats.isFile()) {
    return FileType.file
  }

  return FileType.unknown
}

/**
 * Get a file based on the absolute (real) path given
 *
 * @param {string} absolutePath
 * @return {Promise.<File>}
 */
async function stat(absolutePath) {
  logger.debug(absolutePath)

  const stats = await util.promisify(fs.stat)(absolutePath)
  const fileType = getFileType(stats)

  if (fileType === FileType.unknown) {
    throw new Error('unkown file type')
  }

  const virtualPath = await getVirtualPath(absolutePath)
  return new File(absolutePath, virtualPath, fileType)
}

module.exports = stat
