import fs = require('fs')
import path = require('path')
import util = require('util')
const mime = require('mime-types')
const config = require('../../infrastructure/config')
const logger = require('../../infrastructure/logger')
import File = require('../domain/file')
import FileType = require('../domain/filetype')
const errors = require('../domain/errors')

function isInSharedFolder(physicalPath: string): boolean {
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
 */
function getPhysicalPath(virtualPath: string): string {
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

function getFileType(stats: fs.Stats): FileType {
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
 */
async function stat(virtualPath: string): Promise<File> {
  logger.debug(virtualPath)

  if (!virtualPath || virtualPath === '/') {
    return File.root
  }

  const physicalPath = getPhysicalPath(virtualPath)
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

export = stat
