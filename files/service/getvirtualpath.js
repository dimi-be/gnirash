const path = require('path')

/**
 * Transforms the absolute path into a virtual one
 * on the filesystem.
 *
 * @param {string} absolutePath
 * @return {Promise.<string>}
 */
async function getVirtualPath(absolutePath) {
  const currentDirPath = __dirname
  const rootPath = path.join(currentDirPath, '/../../test-folder')
  const subPath = absolutePath.substr(rootPath.length)
  const virtualPath = subPath.charAt(0) === '/'
    ? subPath
    : `/${subPath}`

  return Promise.resolve(virtualPath)
}

module.exports = getVirtualPath
