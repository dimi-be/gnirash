const path = require('path')

/**
 * Transforms the virtualPath into a path that exists
 * on the filesystem.
 *
 * @param {string} virtualPath
 * @return {Promise.<string>}
 */
async function getPhysicalPath(virtualPath) {
  const currentDirPath = __dirname
  const physicalPath = virtualPath
    ? path.join(currentDirPath, '/../../test-folder', virtualPath)
    : path.join(currentDirPath, '/../../test-folder')

  return Promise.resolve(physicalPath)
}

module.exports = getPhysicalPath
