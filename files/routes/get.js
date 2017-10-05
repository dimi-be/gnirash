const path = require('path')
const dateFormat = require('date-format')
const fileSize = require('filesize')
const logger = require('../../infrastructure/logger')
const settings = require('../domain/settings')
const File = require('../domain/file')
const FileType = require('../domain/filetype')
const fileService = require('../service')

class FileDto {
  /**
   * @param {File} file
   */
  constructor(file) {
    this.name = file.name
    this.fileType = file.fileType
    this.virtualPath = path.join(`/${settings.name}`, file.virtualPath)
    this.physicalPath = file.physicalPath
    this.virtualPathParent = file.virtualPath === '/'
      ? undefined
      : path.join(this.virtualPath, '..')
    this.modifiedDate = dateFormat('yyyy-MM-dd hh:ss', file.modifiedDate)
    this.size = fileSize(file.size)
    this.icon = this.getIcon(file.contentType)
  }

  getIcon(contentType) {
    if (this.fileType === FileType.directory || this.fileType === FileType.root) {
      return 'folder'
    }

    if (typeof contentType === 'string' && contentType.indexOf('/' !== -1)) {
      const [type, subType] = contentType.split('/')

      if (type === 'text' || subType === 'pdf') {
        return 'text'
      }

      if (type === 'image') {
        return 'image'
      }

      if (type === 'video') {
        return 'movie'
      }
    }

    logger.warning(`Can not get icon for ${this.fileType} ${contentType}`)
    return 'unknown'
  }
}

class GetModel {
  constructor() {
    this.title = 'List'
    this.file = {}
    this.files = []
  }
}

/**
 * @param {File} file
 */
async function createModel(file) {
  const model = new GetModel()
  model.file = new FileDto(file)

  if (file.fileType === FileType.directory || file.fileType === FileType.root) {
    const files = await fileService.list(file)
    model.files = files.map(x => new FileDto(x))
  } else if (file.fileType !== FileType.file) {
    throw new Error(`invalid fileType ${file.fileType}`)
  }

  return model
}

/**
 * @param {string} virtualPath
 * @returns {GetModel}
 */
async function get(virtualPath) {
  const file = await fileService.stat(virtualPath)
  return createModel(file)
}

module.exports = get
