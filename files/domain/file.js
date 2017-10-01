class File {
  constructor(path, fileType) {
    this._path = path
    this._fileType = fileType
  }

  get path() {
    return this._path
  }

  get fileType() {
    return this._fileType
  }

  get name() {
    const pathPieces = this._path.split('/')
    return pathPieces[pathPieces.length - 1]
  }
}

module.exports = File
