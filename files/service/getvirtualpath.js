const path = require('path')

/**
 * Transforms the physical path into a virtual one
 * on the filesystem.
 *
 * @param {string} physicalPath
 * @return {Promise.<string>}
 */
async function getVirtualPath(physicalPath) {
  const currentDirPath = __dirname
  const rootPath = path.join(currentDirPath, '/../../test-folder')
  const subPath = physicalPath.substr(rootPath.length)
  const virtualPath = subPath.charAt(0) === '/'
    ? subPath
    : `/${subPath}`

  return Promise.resolve(virtualPath)
}

module.exports = getVirtualPath
