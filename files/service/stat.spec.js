/* eslint-disable prefer-arrow-callback, func-names, no-undef, global-require */
const path = require('path')
const assert = require('assert')
const mock = require('mock-require')

describe('stat', function () {
  before(function () {
    mock('../../infrastructure/config', {
      folders: [{
        name: 'foo',
        path: path.join(__dirname, '../../testdata/test-folder'),
      }],
    })
    mock('../../infrastructure/logger', new Proxy({}, {
      get: () => function () {},
    }))
  })

  after(function () {
    mock.stopAll()
  })

  it('should stat .txt file', function () {
    const stat = require('./stat')

    return stat('foo/file.txt')
      .then((f) => {
        assert.equal(f.virtualPath, 'foo/file.txt')
        assert.equal(f.physicalPath, path.join(__dirname, '../../testdata/test-folder/file.txt'))
      })
  })

  it('should block access outside of shared folders', function () {
    const stat = require('./stat')

    return stat('foo/../test-foobar/bar')
      .then(() => {
        assert.fail('Should not allow access outside of shared folders!')
      })
      .catch((e) => {
        assert.equal(e.message, 'access denied')
      })
  })
})
