const path = require('path')

module.exports = {
  siteTitle: 'gnirash',
  sharedFolders: {
    'test-folder': path.join(__dirname, 'test-folder'),
    'test-foobar': path.join(__dirname, 'test-foobar'),
  },
  secret: "We can't stop here! This is bat country!!",
}
