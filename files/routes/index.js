const router = require('../../infrastructure/router')()
const FileType = require('../domain/filetype')
const errors = require('../domain/errors')
const list = require('./list')

router.get('/*?', async (req, res) => {
  const model = await list.get(req.params[0])

  if (model.file.fileType === FileType.directory || model.file.fileType === FileType.root) {
    res.render('list', model)
  } else if (model.file.fileType === FileType.file) {
    res.download(model.file.physicalPath)
  } else {
    throw Error(errors.unkowFileType)
  }
})

module.exports = router
