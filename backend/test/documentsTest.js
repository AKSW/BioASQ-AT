var
  TIDocuments = require('../src/tidocuments').TIDocuments,
  assert = require('assert'),
  util = require('util');

var s = new TIDocuments('http://www.gopubmed.org/web/gopubmedbeta/bioasq/pubmed');

s.find('diabetes', 0, 10, function (err, res) {
  console.log(res);
  assert.ifError(err);
  process.exit(0);
});