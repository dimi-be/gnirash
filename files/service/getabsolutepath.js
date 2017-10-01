const path = require('path')

function getAbsolutePath(relPath, resolve, reject) {
  try {
    const currentDirPath = __dirname
    const absolutePath = relPath
      ? path.join(currentDirPath, '/../../test-folder', relPath)
      : path.join(currentDirPath, '/../../test-folder')

    resolve(absolutePath)
  } catch (error) {
    reject(error)
  }
}

module.exports = relPath =>
  new Promise((resolve, reject) => getAbsolutePath(relPath, resolve, reject))
