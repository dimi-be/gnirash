const router = require('../../infrastructure/router')()
const FileType = require('../domain/filetype')
const get = require('./get')

router.get('/*?', (req, res, next) => {
  get(req.params[0]).then((model) => {
    if (model.file.fileType === FileType.directory) {
      res.render('get', model)
    } else if (model.file.fileType === FileType.file) {
      res.download(model.file.path)
    } else {
      throw Error(`unkown filetype ${model.file.fileType}`)
    }
  })
  .catch(next)
})

module.exports = router
