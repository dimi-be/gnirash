const FileType = require('./filetype')

class File {
  constructor(physicalPath, virtualPath, fileType) {
    this._physicalPath = physicalPath
    this._virtualPath = virtualPath
    this._fileType = fileType
  }

  get physicalPath() {
    return this._physicalPath
  }

  get virtualPath() {
    return this._virtualPath
  }

  get fileType() {
    return this._fileType
  }

  get name() {
    const pathPieces = this._virtualPath
      .split('/')
      .filter(x => x.length > 0)
    return pathPieces.length === 0
      ? '/'
      : pathPieces[pathPieces.length - 1]
  }

  static get root() {
    return new File('', '/', FileType.root)
  }
}

module.exports = File
