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
 * Get a file based on the physical (real) path given
 *
 * @param {string} physicalPath
 * @return {File}
 */
async function stat(physicalPath) {
  logger.debug(physicalPath)

  const stats = await util.promisify(fs.stat)(physicalPath)
  const fileType = getFileType(stats)

  if (fileType === FileType.unknown) {
    throw new Error('unkown file type')
  }

  const virtualPath = await getVirtualPath(physicalPath)
  const file = new File(
    physicalPath,
    virtualPath,
    fileType,
    stats.mtime,
    stats.blksize)

  return file
}

module.exports = stat
