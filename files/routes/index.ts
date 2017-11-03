import routerfactory from '../../infrastructure/routerfactory'
import FileType = require('../domain/filetype')
import errors = require('../domain/errors')
import * as list from './list'

const router = routerfactory()

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

export = router
