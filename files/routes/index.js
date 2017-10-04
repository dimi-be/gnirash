const router = require('../../infrastructure/router')()
const FileType = require('../domain/filetype')
const errors = require('../domain/errors')
const get = require('./get')

router.get('/*?', async (req, res) => {
  const model = await get(req.params[0])

  if (model.file.fileType === FileType.directory || model.file.fileType === FileType.root) {
    res.render('get', model)
  } else if (model.file.fileType === FileType.file) {
    res.download(model.file.physicalPath)
  } else {
    throw Error(errors.unkowFileType)
  }
})

module.exports = router
