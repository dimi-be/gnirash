const FileType = require('./filetype')

class File {
  /**
   * @param {string} physicalPath
   * @param {string} virtualPath
   * @param {FileType} fileType
   * @param {string} contentType
   * @param {Date} modifiedDate
   * @param {number} size
   */
  constructor(physicalPath, virtualPath, fileType, contentType, modifiedDate, size) {
    this._physicalPath = physicalPath
    this._virtualPath = virtualPath
    this._fileType = fileType
    this._modifiedDate = modifiedDate
    this._size = size
  }

  /**
   * @type {string}
   */
  get physicalPath() {
    return this._physicalPath
  }

  /**
   * @type {string}
   */
  get virtualPath() {
    return this._virtualPath
  }

  /**
   * @type {FileType}
   */
  get fileType() {
    return this._fileType
  }

  /**
   * @type {string}
   */
  get name() {
    const pathPieces = this._virtualPath
      .split('/')
      .filter(x => x.length > 0)
    return pathPieces.length === 0
      ? '/'
      : pathPieces[pathPieces.length - 1]
  }

  /**
   * @type {Date}
   */
  get modifiedDate() {
    return this._modifiedDate
  }

  /**
   * @type {number}
   */
  get size() {
    return this._size
  }


  get icon() {
    if (this._fileType === FileType.directory) {
      return 'folder'
    }

    return 'unkown'
  }

  static get root() {
    return new File('', '/', FileType.root)
  }
}

module.exports = File
