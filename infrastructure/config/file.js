const fs = require('fs')

function readConfigFile(path) {
  const contents = fs.readFileSync(path)
  const json = JSON.parse(contents)

  return json
}

module.exports = {
  readConfigFile,
}
