const path = require('path')
const settings = require('../domain/settings')
const File = require('../domain/file')
const FileType = require('../domain/filetype')
const fileService = require('../service')

class FileDto {
  constructor(file) {
    this.name = file.name
    this.fileType = file.fileType
    this.virtualPath = path.join(`/${settings.name}`, file.virtualPath)
    this.physicalPath = file.physicalPath
    this.virtualPathParent = file.virtualPath === '/'
      ? undefined
      : path.join(this.virtualPath, '..')
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
  let file

  if (!virtualPath || virtualPath === '/') {
    file = File.root
  } else {
    const physicalPath = await fileService.getPhysicalPath(virtualPath)
    file = await fileService.stat(physicalPath)
  }

  return createModel(file)
}

module.exports = get
