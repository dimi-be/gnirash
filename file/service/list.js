const fs = require('fs')
const logger = require('../../infrastructure/logger')

function listDirectory(resolve, reject) {
  const currentDirPath = __dirname
  const listDirPath = currentDirPath + '/../../test-folder'
  
  logger.info(`readdir ${listDirPath}`)
  
  fs.readdir(listDirPath, (err, files) => {
    logger.info('readdir callback', err, files)
    
    if(err) {
      logger.error(err)
      reject('Error while listing directory.')
    }
    
    resolve(files)
  })
}

module.exports = function() {
  return new Promise(listDirectory)
}
