const FileType = require('../domain/filetype')
const fileService = require('../service')

class FileDto {
  constructor() {
    this.name = ''
    this.fileType = FileType.unknown
    this.virtualPath = ''
    this.absolutePath = ''
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
  model.file.absolutePath = file.absolutePath

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
  const absolutePath = await fileService.getAbsolutePath(virtualPath)
  const file = await fileService.stat(absolutePath)

  return createModel(file)
}

module.exports = get
