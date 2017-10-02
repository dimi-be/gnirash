const fs = require('fs')
const util = require('util')
const path = require('path')
const stat = require('./stat')

/**
 * Returns a list of files and directories in the given directory
 *
 * @param {File} directory
 * @returns {Promise.<File[]>}
 */
async function list(directory) {
  const files = await util.promisify(fs.readdir)(directory.path)
  const stats = files
    .map(x => path.join(directory.path, x))
    .map(x => stat(x))

  return Promise.all(stats)
}

module.exports = list
