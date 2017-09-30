/* eslint-disable no-underscore-dangle */
const path = require('path')
const fs = require('fs')
const pug = require('pug')
const logger = require('./logger')

class Render {
  configure(app) {
    app.use((...args) => this._replaceRenderFunction(...args))
  }

  _replaceRenderFunction(request, response, next) {
    response.render = this._render
    next()
  }

  // In this context 'this' is a response object
  _render(...args) {
    Promise.all([
      Render._getView(args, this.req.baseUrl),
      Render._getModel(args),
    ])
    .then(([view, model]) => Render.renderViewFile(view, model))
    .then((output) => {
      this.send(output)
    })
    .catch((error) => {
      this.status = 500
      this.send(error)
      this.error(error)
    })
  }

  static _getModel(para) {
    return new Promise((resolve, reject) => {
      if (para.length === 0) {
        resolve(undefined)
      } else if (para.length === 1) {
        resolve(para[0])
      } else if (para.length === 2) {
        resolve(para[1])
      } else {
        reject('Render only has two parameters')
      }
    })
  }

  static _getView(para, originalUrl) {
    return new Promise((resolve) => {
      const urlPieces = originalUrl
        .split('/')
        .filter(v => (v ? v !== '' : false))
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

      resolve(viewPath)
    })
  }

  static renderViewFile(view, model = undefined) {
    return new Promise((resolve, reject) => {
      logger.debug(view, model)
      fs.readFile(view, (error, template) => {
        if (error) {
          reject(error)
          return
        }

        const output = model
          ? pug.render(template, model)
          : pug.render(template)

        resolve(output)
      })
    })
  }
}

module.exports = new Render()
