/* eslint-disable class-methods-use-this */
const path = require('path')

class Render {
  configure(app) {
    app.use((...args) => this._replaceRenderFunction(...args))
  }

  _replaceRenderFunction(request, response, next) {
    const render = response.render

    response.render = (...args) => {
      this._render(response, render, ...args)
    }

    next()
  }

  _render(response, render, ...args) {
    const viewPath = this._getViewPath(args, response.req.originalUrl)
    const model = this._getModel(args)
    render.call(response, viewPath, model)
  }

  _getModel(para) {
    if (para.length === 0 || (para.length === 1 || typeof para[0] === 'string')) {
      return {}
    } else if (para.length === 1) {
      return para[0]
    } else if (para.length === 2) {
      return para[1]
    }

    throw new Error('Render only has two parameters')
  }

  _getViewPath(para, originalUrl) {
    const urlPieces = originalUrl
      .split('/')
      .filter(v => (v !== ''))
      .concat([''])
    const viewFile = path.join(
      __dirname,
      '..',
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
}

module.exports = new Render()
