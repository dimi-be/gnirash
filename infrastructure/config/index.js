const commandLineArgs = require('./commandlineargs')
const file = require('./file')
const Config = require('./config')

const configFilePath = commandLineArgs.getConfigFilePath()
const userConfig = file.readConfigFile(configFilePath)

const config = new Config(userConfig, configFilePath)

module.exports = config
