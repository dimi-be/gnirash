const path = require('path')

module.exports = {
  siteTitle: 'gnirash',
  sharedFolders: [
    {
      name: 'test-folder',
      path: path.join(__dirname, 'testdata/test-folder'),
    },
    {
      name: 'test-foobar',
      path: path.join(__dirname, 'testdata/test-foobar'),
    },
  ],
  users: [
    {
      name: 'test',
      key: '007',
    },
  ],
  secret: "We can't stop here! This is bat country!!",
}
