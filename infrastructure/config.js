const process = require('process')
const path = require('path')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'config', alias: 'c', type: String },
]

class Folder {
  constructor(name, fPath) {
    this.name = name
    this.path = fPath
  }
}

class User {
  constructor(name, key) {
    this.name = name
    this.key = key
  }
}

class Config {
  constructor(configFilePath) {
    /* eslint-disable import/no-dynamic-require, global-require */
    const cfg = require(configFilePath)
    this._configFilePath = configFilePath
    this.port = cfg.port
    this.protocol = cfg.protocol ? cfg.protocol : 'https'
    this.https = this._createHttpsSettings(cfg.https)
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

  _createHttpsSettings(cfg) {
    if (!cfg) {
      return {}
    }

    return {
      cert: this._getAboslutePath(cfg.cert),
      key: this._getAboslutePath(cfg.key),
    }
  }

  _getAboslutePath(relPath) {
    if (relPath.startsWith('/')) {
      return relPath
    }

    return path.join(path.dirname(this._configFilePath), relPath)
  }
}

const options = commandLineArgs(optionDefinitions)

let configFilePath
if (options.config.startsWith('/')) {
  configFilePath = options.config
} else {
  configFilePath = path.join(process.cwd(), options.config)
}


const config = new Config(configFilePath)

module.exports = config
