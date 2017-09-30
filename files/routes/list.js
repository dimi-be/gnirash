const fileService = require('../service')

module.exports = subDir =>
  new Promise((resolve, reject) => {
    Promise.all([fileService.list(subDir)])
    .then(([files]) => {
      resolve({
        files,
      })
    })
    .catch(reject)
  })
