const fs = require('fs')
const path = require('path')
const util = require('util')
const mime = require('mime-types')
const config = require('../../infrastructure/config')
const logger = require('../../infrastructure/logger')
const File = require('../domain/file')
const FileType = require('../domain/filetype')
const errors = require('../domain/errors')

function isInSharedFolder(physicalPath) {
  let inSharedFolder = false

  config.folders.forEach((f) => {
    if (physicalPath.startsWith(f.path)) {
      inSharedFolder = true
    }
  })

  return inSharedFolder
}

/**
 * Transforms the virtualPath into a path that exists
 * on the filesystem.
 *
 * @param {string} virtualPath
 * @return {string}
 */
async function getPhysicalPath(virtualPath) {
  const pathPieces = virtualPath.split('/').filter(x => x !== '')
  const sharedFolderName = pathPieces[0]
  const sharedFolderPath = config.folders
    .filter(x => x.name === sharedFolderName)[0].path

  if (!sharedFolderPath) {
    throw new Error(errors.fileNotFound)
  }

  const remaingPieces = pathPieces.slice(1)
  const physicalPath = path.join(sharedFolderPath, ...remaingPieces)

  logger.debug(`physicalPath=${physicalPath}`)

  if (!isInSharedFolder(physicalPath)) {
    throw new Error(errors.accessDenied)
  }

  return physicalPath
}

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
 * @param {string} virtualPath
 * @return {File}
 */
async function stat(virtualPath) {
  logger.debug(virtualPath)

  if (!virtualPath || virtualPath === '/') {
    return File.root
  }

  const physicalPath = await getPhysicalPath(virtualPath)
  const stats = await util.promisify(fs.stat)(physicalPath)
  const fileType = getFileType(stats)

  if (fileType === FileType.unknown) {
    throw new Error('unkown file type')
  }

  const contentType = mime.lookup(physicalPath)

  const file = new File(
    physicalPath,
    virtualPath,
    fileType,
    contentType,
    stats.mtime,
    stats.size,
  )

  return file
}

module.exports = stat
