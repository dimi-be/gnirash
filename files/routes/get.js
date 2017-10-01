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

function list(directory) {
  return new Promise((resolve, reject) => {
    Promise.all([fileService.list(directory)])
    .then(([files]) => {
      resolve(new GetModel(directory, files))
    })
    .catch(reject)
  })
}

function singleFile(file) {
  return Promise.resolve(new GetModel(file, []))
}

/**
 *
 * @param {string} relPath
 * @returns {Promise.<GetModel>}
 */
function get(relPath) {
  return new Promise((resolve, reject) => {
    fileService
    .getAbsolutePath(relPath)
    .then(path => fileService.stat(path))
    .then((file) => {
      if (file.fileType === FileType.directory) {
        return list(file)
      } else if (file.fileType === FileType.file) {
        return singleFile(file)
      }

      logger.error(`invalid fileType ${file.fileType}`)
      return Promise.reject(`invalid fileType ${file.fileType}`)
    })
    .then(resolve)
    .catch(reject)
  })
}

module.exports = get
