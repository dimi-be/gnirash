const FileType = require('../domain/filetype')
const fileService = require('../service')

class GetModel {
  /**
   * @param {File} file
   * @param {File[]} files
   */
  constructor(file, files) {
    this.title = 'List'
    this.file = file
    this.files = files
  }
}

async function createModel(file) {
  if (file.fileType === FileType.directory) {
    const files = await fileService.list(file)
    return new GetModel(file, files)
  } else if (file.fileType === FileType.file) {
    return new GetModel(file, [])
  }

  throw new Error(`invalid fileType ${file.fileType}`)
}

/**
 * @param {string} virtualPath
 * @returns {Promise.<GetModel>}
 */
async function get(virtualPath) {
  const absolutePath = await fileService.getAbsolutePath(virtualPath)
  const file = await fileService.stat(absolutePath)

  return createModel(file)
}

module.exports = get
