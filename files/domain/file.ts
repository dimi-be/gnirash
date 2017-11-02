import FileType = require('./filetype')

class File {
  private static _root = new File('', '/', FileType.root, undefined, new Date(1986, 0, 1), 0)

  private _physicalPath: string
  private _virtualPath: string
  private _fileType: FileType
  private _contentType: string
  private _modifiedDate: Date
  private _size: number

  constructor(physicalPath: string,
      virtualPath: string,
      fileType: FileType,
      contentType: string,
      modifiedDate: Date,
      size: number) {
    this._physicalPath = physicalPath
    this._virtualPath = virtualPath
    this._fileType = fileType
    this._contentType = contentType
    this._modifiedDate = modifiedDate
    this._size = size
  }

  get physicalPath(): string {
    return this._physicalPath
  }

  get virtualPath(): string {
    return this._virtualPath
  }

  get fileType(): FileType {
    return this._fileType
  }

  get name(): string {
    const pathPieces = this._virtualPath
      .split('/')
      .filter(x => x.length > 0)
    return pathPieces.length === 0
      ? '/'
      : pathPieces[pathPieces.length - 1]
  }

  get contentType(): string {
    return this._contentType
  }

  get modifiedDate(): Date {
    return this._modifiedDate
  }

  get size(): number {
    return this._size
  }

  static get root(): File {
    return File._root
  }
}

export = File
