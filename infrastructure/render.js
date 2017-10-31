const path = require('path')
const config = require('./config')

function getViewPath(para, originalUrl) {
  const urlPieces = originalUrl
    .split('/')
    .filter(v => (v !== ''))
    .concat([''])
  const viewFile = path.join(
    config.programRoot,
    urlPieces[0],
    'routes',
    urlPieces[urlPieces.length - 1],
  )

  const viewBaseName = (para.length === 1 && typeof para[0] !== 'string') || para.length === 0
    ? path.join(viewFile, urlPieces[1])
    : path.join(viewFile, para[0])

  const viewPath = `${viewBaseName}.pug`

  return viewPath
}

function getModel(para) {
  if (para.length === 0 || (para.length === 1 && typeof para[0] === 'string')) {
    return {}
  } else if (para.length === 1) {
    return para[0]
  } else if (para.length === 2) {
    return para[1]
  }

  throw new Error('Render only has two parameters')
}

function customRender(response, render, ...args) {
  const viewPath = getViewPath(args, response.req.baseUrl)
  const model = getModel(args)
  render.call(response, viewPath, model)
}

function replaceRenderFunction(request, response, next) {
  const render = response.render

  response.render = (...args) => {
    customRender(response, render, ...args)
  }

  next()
}

function middleware() {
  return ((...args) => replaceRenderFunction(...args))
}

module.exports = {
  middleware,
}
