const fs = require('fs')
const util = require('util')
const path = require('path')
const config = require('../../infrastructure/config')
const File = require('../domain/file')
const FileType = require('../domain/filetype')
const stat = require('./stat')

/**
 * Returns a list of files and directories in the given directory
 *
 * @param {File} directory
 * @returns {File[]}
 */
async function list(directory) {
  if (directory.fileType === FileType.root) {
    const files = config.folders
      .map(folder => new File(
        folder.path,
        path.join('/', folder.name),
        FileType.directory,
        false,
        new Date(1986, 0, 1),
        0,
      ))
    return files
  }

  const files = await util.promisify(fs.readdir)(directory.physicalPath)
  const stats = files
    .sort()
    .map(x => path.join(directory.virtualPath, x))
    .map(x => stat(x))

  return Promise.all(stats)
}

module.exports = list
