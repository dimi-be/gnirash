const path = require('path')
const Folder = require('./folder')
const User = require('./user')

class Config {
  constructor(cfg, configFilePath) {
    this._configFilePath = configFilePath
    this.port = cfg.port
    this.https = this._createHttpsSettings(cfg.https)
    this.protocol = this.https ? 'https' : 'http'
    this.siteTitle = cfg.siteTitle
    this.secret = cfg.secret
    this.users = cfg.users.map(u => new User(u.name, u.key))
    this.folders = this._createSharedFolders(cfg.folders)
  }

  _createSharedFolders(folders) {
    return folders.map((v) => {
      const absPath = this._getAboslutePath(v.path)
      return new Folder(v.name, absPath)
    })
  }

  _createHttpsSettings(httpsCfg) {
    if (!httpsCfg || !httpsCfg.cert || !httpsCfg.key) {
      return undefined
    }

    return {
      cert: this._getAboslutePath(httpsCfg.cert),
      key: this._getAboslutePath(httpsCfg.key),
    }
  }

  _getAboslutePath(relPath) {
    if (relPath.startsWith('/')) {
      return relPath
    }

    return path.join(path.dirname(this._configFilePath), relPath)
  }
}

module.exports = Config
