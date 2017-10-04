const fs = require('fs')
const util = require('util')
const path = require('path')
const config = require('../../config')
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
    const files = Object.keys(config.sharedFolders)
      .map(name => new File(
        config.sharedFolders[name],
        path.join('/', name),
        FileType.directory,
      ))
    return files
  }

  const files = await util.promisify(fs.readdir)(directory.physicalPath)
  const stats = files
    .sort()
    .map(x => path.join(directory.physicalPath, x))
    .map(x => stat(x))

  return Promise.all(stats)
}

module.exports = list
