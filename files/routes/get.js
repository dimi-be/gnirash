const logger = require('../../infrastructure/logger')
const FileType = require('../domain/filetype')
const fileService = require('../service')

class GetModel {
  /**
   *
   * @param {File} file
   * @param {File[]} files
   */
  constructor(file, files) {
    this._file = file
    this._files = files
  }

  get file() {
    return this._file
  }

  get files() {
    return this._files
  }
}

function createModel(file) {
  if (file.fileType === FileType.directory) {
    return fileService.list(file)
      .then(files =>
        Promise.resolve(new GetModel(file, files)))
  } else if (file.fileType === FileType.file) {
    return Promise.resolve(new GetModel(file, []))
  }

  logger.error(`invalid fileType ${file.fileType}`)
  return Promise.reject(`invalid fileType ${file.fileType}`)
}

/**
 * @param {string} virtualPath
 * @returns {Promise.<GetModel>}
 */
function get(virtualPath) {
  return Promise.resolve()
    .then(() => fileService.getAbsolutePath(virtualPath))
    .then(absolutePath => fileService.stat(absolutePath))
    .then(createModel)
}

module.exports = get
