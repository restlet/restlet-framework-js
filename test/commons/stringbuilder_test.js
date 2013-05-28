var StringBuilder = require('../../build/nodejs/lib/commons.js').StringBuilder;

var sb = new StringBuilder();
sb.append('this is');
sb.append(' a test string');

exports['toString'] = function (test) {
  test.equal(sb.toString(), 'this is a test string');
  test.done();
};

exports['substring'] = function (test) {
  var s1 = sb.substring(5, 10);
  test.equal(s1, 'is a ');
  test.done();
};

exports['charAt'] = function (test) {
  var c = sb.charAt(5);
  test.equal(c, 'i');
  test.done();
};

exports['delete'] = function (test) {
  sb.delete(5, 10);
  test.equal(sb.toString(), 'this test string');
  test.done();
};