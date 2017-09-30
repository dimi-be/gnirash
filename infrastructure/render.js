const path = require('path')
const fs = require('fs')
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
  const urlPieces = originalUrl
    .split('/')
    .filter(v => v ? v !== '' : false)
    .concat([''])
  const viewFile = path.join(
    __dirname,
    '..',
    urlPieces[0],
    'routes',
    urlPieces[urlPieces.length - 1],
  )

  const viewBaseName = para.length === 1 || para.length === 0
    ? path.join(viewFile, urlPieces[1])
    : path.join(viewFile, para[0])

  const viewPath = `${viewBaseName}.pug`
  return viewPath
}

function renderView(view, model = undefined) {
  logger.debug(view, model)

  return new Promise((resolve, reject) => {
    fs.readFile(view, (error, template) => {
      if (error) {
        reject(error)
      }

      const output = model
        ? pug.render(template, model)
        : pug.render(template)

      resolve(output)
    })
  })
}

function middleware(request, response, next) {
  response.render = (...para) => {
    const view = getView(para, request.baseUrl)
    const model = getModel(para)
    renderView(view, model)
    .then((output) => {
      response.send(output)
    })
    .catch((error) => {
      response.status = 500
      response.send(error)
    })
  }

  next()
}

module.exports = {
  configure: (router) => {
    router.use(middleware)
  },
}
