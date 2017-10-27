const process = require('process')
const path = require('path')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'config', alias: 'c', type: String },
]

function getConfigFilePath() {
  const options = commandLineArgs(optionDefinitions)

  if (options.config.startsWith('/')) {
    return options.config
  }

  return path.join(process.cwd(), options.config)
}

module.exports = {
  getConfigFilePath,
}
