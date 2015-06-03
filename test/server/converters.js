var assert = require('assert');
var converters = require('../../lib/converter');
var testUtils = require('./test-utils');

describe('converters', function() {
  describe('xml2js converter', function() {
    it('simple conversion obj to xml', function() {
      var converter = converters.getBuiltinConverter('xml2js');

      var xmlString = null;
      converter.toString({ attr1: 10, attr2: 'my string'}, function(err, s) {
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
        + '</root>', function(err, obj) {
          savedObj = obj;
        });

      assert.equal('10', savedObj.attr1[0]);
      assert.equal('my string', savedObj.attr2[0]);
    });

    it('simple conversion xml to obj (error)', function() {
      var converter = converters.getBuiltinConverter('xml2js');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('<root>\n'
        + ' <attr1>10</attr1\n'
        + ' <attr2>my string</attr2>\n'
        + '</root>', function(err, obj) {
          savedObj = obj;
          savedErr = err;
        });

      assert.equal(null, savedObj);
      assert.notEqual(null, savedErr);
    });
  });

  describe('json converter', function() {
    it('simple conversion obj to json', function() {
      var converter = converters.getBuiltinConverter('json');

      var jsonString = null;
      converter.toString({ attr1: 10, attr2: 'my string'}, function(err, s) {
        jsonString = s;
      });

      assert.equal('{"attr1":10,"attr2":"my string"}', jsonString);
    });

    it('simple conversion json to obj', function() {
      var converter = converters.getBuiltinConverter('json');

      var savedObj = null;
      converter.toObject('{\n'
        + ' "attr1": 10,\n'
        + ' "attr2": "my string"\n'
        + '}', function(err, obj) {
          savedObj = obj;
        });

      assert.equal(10, savedObj.attr1);
      assert.equal('my string', savedObj.attr2);
    });

    it('simple conversion json to obj (error)', function() {
      var converter = converters.getBuiltinConverter('json');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('{\n'
        + ' "attr1": 10\n'
        + ' "attr2": "my string"\n'
        + '}', function(err, obj) {
          savedErr = err;
          savedObj = obj;
        });

      assert.equal(null, savedObj);
      assert.notEqual(null, savedErr);
    });
  });

  describe('yaml converter', function() {
    it('simple conversion obj to yaml', function() {
      var converter = converters.getBuiltinConverter('js-yaml');

      var yamlString = null;
      converter.toString({ attr1: 10, attr2: 'my string'}, function(err, s) {
        yamlString = s;
      });

      assert.equal('attr1: 10\nattr2: my string\n', yamlString);
    });

    it('simple conversion yaml to obj', function() {
      var converter = converters.getBuiltinConverter('js-yaml');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('attr1: 10\n'
        + 'attr2: my string\n',
        function(err, obj) {
          savedObj = obj;
          savedErr = err;
        });

      assert.equal(10, savedObj.attr1);
      assert.equal('my string', savedObj.attr2);
    });

    it('simple conversion yaml to obj (error)', function() {
      var converter = converters.getBuiltinConverter('js-yaml');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('{attr1: 10\n'
        + 'attr2: my string',
        function(err, obj) {
          savedObj = obj;
          savedErr = err;
        });

      assert.equal(null, savedObj);
      assert.notEqual(null, savedErr);
    });
  });
});