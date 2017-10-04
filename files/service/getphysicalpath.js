const path = require('path')
const config = require('../../config')
const errors = require('../domain/errors')

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
  const sharedFolderPath = config.sharedFolders[sharedFolderName]

  if (!sharedFolderPath) {
    throw new Error(errors.fileNotFound)
  }

  const remaingPieces = pathPieces.slice(1)
  const physicalPath = path.join(sharedFolderPath, ...remaingPieces)

  return physicalPath
}

module.exports = getPhysicalPath
