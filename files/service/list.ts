import fs = require('fs')
import util = require('util')
const path = require('path')
const config = require('../../infrastructure/config')
import File = require('../domain/file')
import FileType = require('../domain/filetype')
import stat = require('./stat')

/**
 * Returns a list of files and directories in the given directory
 */
export default async function list(directory: File): Promise<File[]> {
  if (directory.fileType === FileType.root) {
    const files = config.folders
      .map(folder => new File(
        folder.path,
        path.join('/', folder.name),
        FileType.directory,
        undefined,
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
