class FileType {
  private static _directory = new FileType('directory')
  private static _file = new FileType('file')
  private static _root = new FileType('root')
  private static _unkown = new FileType('unkown')

  private _fileType: string

  private constructor(fileType: string) {
    this._fileType = fileType
  }

  public toString(): string {
    return this._fileType
  }

  static get directory(): FileType {
    return FileType._directory
  }

  static get file(): FileType {
    return FileType._file
  }

  static get root(): FileType {
    return FileType._root
  }

  static get unknown(): FileType {
    return FileType._unkown
  }
}

export = FileType
