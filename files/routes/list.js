const fileService = require('../service')

module.exports = () =>
  new Promise((resolve, reject) => {
    Promise.all([fileService.list()])
    .then(([files]) => {
      resolve({
        files,
      })
    })
    .catch(reject)
  })
