const router = require('../../infrastructure/router')()
const FileType = require('../domain/filetype')
const get = require('./get')

router.get('/*?', async (req, res) => {
  const model = await get(req.params[0])

  if (model.file.fileType === FileType.directory) {
    res.render('get', model)
  } else if (model.file.fileType === FileType.file) {
    res.download(model.file.absolutePath)
  } else {
    throw Error(`unkown filetype ${model.file.fileType}`)
  }
})

module.exports = router
