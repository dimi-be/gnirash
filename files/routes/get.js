const FileType = require('../domain/filetype')
const fileService = require('../service')

function list(file) {
  return new Promise((resolve, reject) => {
    Promise.all([fileService.list(file.path)])
    .then(([files]) => {
      resolve({
        files,
      })
    })
    .catch(reject)
  })
}

function get(relPath, resolve, reject) {
  fileService
    .getAbsolutePath(relPath)
    .then(path => fileService.stat(path))
    .then((file) => {
      if (file.fileType === FileType.directory) {
        list(file)
          .then(resolve)
          .catch(reject)
      }
    })
    .catch(reject)
}

module.exports = path =>
  new Promise((resolve, reject) => get(path, resolve, reject))
