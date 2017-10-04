const FileType = require('../domain/filetype')
const fileService = require('../service')

class FileDto {
  constructor() {
    this.name = ''
    this.fileType = FileType.unknown
    this.virtualPath = ''
    this.physicalPath = ''
  }
}

class GetModel {
  constructor() {
    this.title = 'List'
    this.file = new FileDto()
    this.files = []
  }
}

async function createModel(file) {
  const model = new GetModel()
  model.file.name = file.name
  model.file.fileType = file.fileType
  model.file.virtualPath = file.virtualPath
  model.file.physicalPath = file.physicalPath

  if (file.fileType === FileType.directory) {
    const files = await fileService.list(file)
    model.files = files.map((x) => {
      const f = new FileDto()
      f.name = x.name
      f.fileType = x.fileType
      f.virtualPath = x.virtualPath
      return f
    })
  } else if (file.fileType !== FileType.file) {
    throw new Error(`invalid fileType ${file.fileType}`)
  }

  return model
}

/**
 * @param {string} virtualPath
 * @returns {Promise.<GetModel>}
 */
async function get(virtualPath) {
  const physicalPath = await fileService.getPhysicalPath(virtualPath)
  const file = await fileService.stat(physicalPath)

  return createModel(file)
}

module.exports = get
