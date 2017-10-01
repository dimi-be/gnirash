const path = require('path')

/**
 * Transforms the virtualPath into a path that exists
 * on the filesystem.
 *
 * @param {string} virtualPath
 * @return {Promise.<string>}
 */
function getAbsolutePath(virtualPath) {
  return Promise.resolve()
    .then(() => {
      const currentDirPath = __dirname
      const absolutePath = virtualPath
        ? path.join(currentDirPath, '/../../test-folder', virtualPath)
        : path.join(currentDirPath, '/../../test-folder')

      return Promise.resolve(absolutePath)
    })
}

module.exports = getAbsolutePath
