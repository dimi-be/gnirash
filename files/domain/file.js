class File {
  constructor(absolutePath, virtualPath, fileType) {
    this._absolutePath = absolutePath
    this._virtualPath = virtualPath
    this._fileType = fileType
  }

  get absolutePath() {
    return this._absolutePath
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
}

module.exports = File
