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
  constructor(cfg) {
    this.port = cfg.port
    this.protocol = cfg.protocol ? cfg.protocol : 'https'
    this.https = Config.createHttpsSettings(cfg)
    this.siteTitle = cfg.siteTitle
    this.secret = cfg.secret
    this.users = cfg.users.map(u => new User(u.name, u.key))
    this.folders = Config.createSharedFolders(cfg.folders)
  }

  static createSharedFolders(folders) {
    return folders.map((v) => {
      const absPath = Config.getAboslutePath(v.path)
      return new Folder(v.name, absPath)
    })
  }

  static createHttpsSettings(cfg) {
    if (!cfg) {
      return {}
    }

    return {
      cert: Config.getAboslutePath(cfg.https.cert),
      key: Config.getAboslutePath(cfg.https.key),
    }
  }

  static getAboslutePath(relPath) {
    if (relPath.startsWith('/')) {
      return relPath
    } else if (relPath.startsWith('..')) {
      return path.join(__dirname, '../..', relPath)
    } else if (relPath.startsWith('.')) {
      return path.join(__dirname, '..', relPath)
    }

    return relPath
  }
}

const options = commandLineArgs(optionDefinitions)

let configFilePath
if (options.config.startsWith('/')) {
  configFilePath = options.config
} else {
  configFilePath = path.join(process.cwd(), options.config)
}

/* eslint-disable import/no-dynamic-require */
const configFile = require(configFilePath)
const config = new Config(configFile)

module.exports = config
