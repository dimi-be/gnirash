const path = require('path')
const pug = require('pug')
const logger = require('./logger')

function getModel(para) {
  if (para.length === 0) {
    return undefined
  }

  if (para.length === 1) {
    return para[0]
  }

  return para[1]
}

function getView(para, originalUrl) {
  const urlPieces = originalUrl.split('/')
  const viewFile = path.join(
    __dirname,
    '..',
    ...urlPieces.slice(0, -1),
    'routes',
    urlPieces[urlPieces.length - 1],
  )

  const viewBaseName = para.length === 1 || para.length === 0
    ? viewFile
    : path.join(viewFile, '..', para[0])

  const viewPath = `${viewBaseName}.pug`
  logger.info(viewPath)
  return viewPath
}

function middleware (request, response, next) {
  response.render = (...para) => {
    const view = getView(para, request.originalUrl)
    const model = getModel(para)
    const compiledFuntion = pug.compileFile(view)
    const output = compiledFuntion(model)
    response.send(output)
  }

  next()
}

module.exports = {
  configure: (router) => {
    router.use(middleware)
  },
}
