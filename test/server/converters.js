var assert = require('assert');
var converters = require('../../lib/converter');
var testUtils = require('./test-utils');

describe('converters', function() {
  describe('xml2js converter', function() {
    it('simple conversion obj to xml', function() {
      var converter = converters.getBuiltinConverter('xml2js');

      var xmlString = null;
      converter.toString({ attr1: 10, attr2: 'my string'}, function(s) {
        xmlString = s;
      });

      assert.equal('<root>\n'
        + ' <attr1>10</attr1>\n'
        + ' <attr2>my string</attr2>\n'
        + '</root>', xmlString);
    });

    it('simple conversion xml to obj', function() {
      var converter = converters.getBuiltinConverter('xml2js');

      var savedObj = null;
      converter.toObject('<root>\n'
        + ' <attr1>10</attr1>\n'
        + ' <attr2>my string</attr2>\n'
        + '</root>', function(obj) {
          savedObj = obj;
        });

      assert.equal('10', savedObj.attr1[0]);
      assert.equal('my string', savedObj.attr2[0]);
    });
  });
});