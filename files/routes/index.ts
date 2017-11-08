import { routerFactory } from '../../infrastructure/server/routerfactory'
import FileType = require('../domain/filetype')
import errors = require('../domain/errors')
import * as list from './list'

export const filesRoutes = routerFactory()

filesRoutes.get('/*?', async (req, res) => {
  const model = await list.get(req.params[0])

  if (model.file.fileType === FileType.directory || model.file.fileType === FileType.root) {
    res.render('list', model)
  } else if (model.file.fileType === FileType.file) {
    res.download(model.file.physicalPath)
  } else {
    throw Error(errors.unkowFileType)
  }
})
