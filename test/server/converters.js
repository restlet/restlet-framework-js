'use strict';

var assert = require('assert');
var converters = require('../../lib/converter');

describe('converters', function () {
  describe('xml2js converter', function () {
    it('simple conversion obj to xml', function () {
      var converter = converters.getBuiltinConverter('xml2js');

      var xmlString = null;
      converter.toString({ attr1: 10, attr2: 'my string' }, function (err, s) {
        xmlString = s;
      });

      assert.equal(xmlString, '<root>\n'
        + ' <attr1>10</attr1>\n'
        + ' <attr2>my string</attr2>\n'
        + '</root>');
    });

    it('simple conversion xml to obj', function () {
      var converter = converters.getBuiltinConverter('xml2js');

      var savedObj = null;
      converter.toObject('<root>\n'
        + ' <attr1>10</attr1>\n'
        + ' <attr2>my string</attr2>\n'
        + '</root>', function (err, obj) {
        savedObj = obj;
      });

      assert.equal(savedObj.attr1[ 0 ], '10');
      assert.equal(savedObj.attr2[ 0 ], 'my string');
    });

    it('simple conversion xml to obj with null input', function () {
      var converter = converters.getBuiltinConverter('xml2js');

      var savedObj = null;
      var savedErr = null;
      converter.toObject(null, function (err, obj) {
        savedObj = obj;
        savedErr = err;
      });

      assert.equal(savedObj, null);
      assert.equal(savedErr, null);
    });

    it('simple conversion xml to obj (error)', function () {
      var converter = converters.getBuiltinConverter('xml2js');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('<root>\n'
        + ' <attr1>10</attr1\n'
        + ' <attr2>my string</attr2>\n'
        + '</root>', function (err, obj) {
        savedObj = obj;
        savedErr = err;
      });

      assert.equal(savedObj, null);
      assert.notEqual(savedErr, null);
    });
  });

  describe('json converter', function () {
    it('simple conversion obj to json', function () {
      var converter = converters.getBuiltinConverter('json');

      var jsonString = null;
      converter.toString({ attr1: 10, attr2: 'my string' }, function (err, s) {
        jsonString = s;
      });

      assert.equal(jsonString, '{"attr1":10,"attr2":"my string"}');
    });

    it('simple conversion json to obj', function () {
      var converter = converters.getBuiltinConverter('json');

      var savedObj = null;
      converter.toObject('{\n'
        + ' "attr1": 10,\n'
        + ' "attr2": "my string"\n'
        + '}', function (err, obj) {
        savedObj = obj;
      });

      assert.equal(savedObj.attr1, 10);
      assert.equal(savedObj.attr2, 'my string');
    });

    it('simple conversion json to obj with null input', function () {
      var converter = converters.getBuiltinConverter('json');

      var savedObj = null;
      var savedErr = null;
      converter.toObject(null, function (err, obj) {
        savedErr = err;
        savedObj = obj;
      });

      assert.equal(savedObj, null);
      assert.equal(savedErr, null);
    });

    it('simple conversion json to obj (error)', function () {
      var converter = converters.getBuiltinConverter('json');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('{\n'
        + ' "attr1": 10\n'
        + ' "attr2": "my string"\n'
        + '}', function (err, obj) {
        savedErr = err;
        savedObj = obj;
      });

      assert.equal(savedObj, null);
      assert.notEqual(savedErr, null);
    });
  });

  describe('yaml converter', function () {
    it('simple conversion obj to yaml', function () {
      var converter = converters.getBuiltinConverter('js-yaml');

      var yamlString = null;
      converter.toString({ attr1: 10, attr2: 'my string' }, function (err, s) {
        yamlString = s;
      });

      assert.equal(yamlString, 'attr1: 10\nattr2: my string\n');
    });

    it('simple conversion yaml to obj', function () {
      var converter = converters.getBuiltinConverter('js-yaml');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('attr1: 10\n'
        + 'attr2: my string\n',
        function (err, obj) {
          savedObj = obj;
          savedErr = err;
        });

      assert.equal(savedObj.attr1, 10);
      assert.equal(savedObj.attr2, 'my string');
    });

    it('simple conversion yaml to obj with null input', function () {
      var converter = converters.getBuiltinConverter('js-yaml');

      var savedObj = null;
      var savedErr = null;
      converter.toObject(null, function (err, obj) {
        savedObj = obj;
        savedErr = err;
      });

      assert.equal(savedObj, null);
      assert.equal(savedErr, null);
    });

    it('simple conversion yaml to obj (error)', function () {
      var converter = converters.getBuiltinConverter('js-yaml');

      var savedObj = null;
      var savedErr = null;
      converter.toObject('{attr1: 10\n'
        + 'attr2: my string',
        function (err, obj) {
          savedObj = obj;
          savedErr = err;
        });

      assert.equal(savedObj, null);
      assert.notEqual(savedErr, null);
    });
  });
  describe('find converter', function () {
    it('builtinConverters()', function () {
      var allConverters = converters.builtinConverters();
      assert.equal(allConverters.length, 3);
      assert.equal(allConverters[ 0 ].name, 'json');
      assert.equal(allConverters[ 1 ].name, 'xml2js');
      assert.equal(allConverters[ 2 ].name, 'js-yaml');
    });

    it('findConverter(null)', function () {
      var converter = converters.findConverter(null);
      assert.notEqual(converter, null);
      assert.equal(converter.name, 'json');
    });

    it('findConverter([something])', function () {
      var converter = converters.findConverter([ 'something' ]);
      assert.equal(converter, null);
    });

    it('findConverter(json) and no builtin converters', function () {
      converters.clearBuiltinConverters();
      var converter = converters.findConverter('json');
      assert.equal(converter, null);
    });
  });
});