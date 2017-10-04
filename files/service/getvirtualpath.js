const path = require('path')
const config = require('../../config')
const errors = require('../domain/errors')

/**
 * Transforms the physical path into a virtual one
 * on the filesystem.
 *
 * @param {string} physicalPath
 * @return {string}
 */
async function getVirtualPath(physicalPath) {
  let virtualPath

  Object.keys(config.sharedFolders).forEach((name) => {
    const sharedFolderPath = config.sharedFolders[name]

    if (physicalPath.indexOf(sharedFolderPath) !== -1) {
      const pathInParent = physicalPath.substr(sharedFolderPath.length)
      virtualPath = path.join(`/${name}`, pathInParent)
    }
  })

  if (virtualPath) {
    return virtualPath
  }

  throw new Error(errors.fileNotFound)
}

module.exports = getVirtualPath
