const logger = require('../../infrastructure/logger')
const fileService = require('../service')

module.exports = function() {
  return new Promise((resolve, reject) => {
    Promise.all([fileService.list()])
    .then(([files]) => {
      resolve({
        files,
      })
    })
    .catch(reject)
  })
}
