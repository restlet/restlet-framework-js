var restlet = require("../../../build/nodejs/index.js");
var utils = require("../../lib/utils.js");

exports['simple resource tests'] = {
  setUp: function(done) {
    this.component = new restlet.Component();
    this.component.getServers().addProtocol(restlet.data.Protocol.HTTP, 8000);

    var application = restlet.Application.create(function() {
      var router = new restlet.Router();
      //r1
      var r1 = restlet.resource.ServerResource.createSubServerResource();
      r1.addMethod("get", "json", function() {
        //console.log("---> r1.handle get (1)");
        //console.log("---> "+restlet.data.MediaType.APPLICATION_JSON);
    	var param = this.getRequestAttributes()['id'];
        var repr = new restlet.representation.StringRepresentation("{\"test\":1,\"param\":\""+param+"\"}", restlet.data.MediaType.APPLICATION_JSON);
        //console.log("> commit");
        this.commit(repr);
        //console.log("< commit");
      }),
      r1.addMethod("get", "html", function() {
        //console.log("---> r1.handle get (2)");
        //console.log("---> "+restlet.data.MediaType.TEXT_HTML);
      	var param = this.getRequestAttributes()['id'];
        var repr = new restlet.representation.StringRepresentation("<html><body>test - param = "+param+"</body></html>", restlet.data.MediaType.TEXT_HTML);
        this.commit(repr);
      }),
      r1.addMethod("put", "json", function(representation) {
        //console.log("---> r1.handle put (1)");
        //console.log("---> "+restlet.data.MediaType.TEXT_HTML);
        var repr = new restlet.representation.StringRepresentation("<html><body>ok put (1)</body></html>", restlet.data.MediaType.TEXT_HTML);
        this.commit(repr);
      });
      r1.addMethod("put", "txt", function(representation) {
        //console.log("---> r1.handle put (2)");
        //console.log("---> "+restlet.data.MediaType.TEXT_HTML);
        var repr = new restlet.representation.StringRepresentation("<html><body>ok put (2)</body></html>", restlet.data.MediaType.TEXT_HTML);
        this.commit(repr);
      });
      router.attach("/test1/{id}", r1);
      return router;
    });
    this.component.getDefaultHost().attachDefault(application);

    this.component.start();
    done();
  },

  tearDown: function(done) {
    this.component.stop();
    done();
  },
 
  'get with json': function (test) {
    var options = utils.createRequestOptions('localhost:8000/test1/id','GET',{});
    utils.executeHttpRequest(test, options, null, function(res) {
      test.equal(200, res.statusCode);
      test.equal('23', res.headers['content-length']);
      test.equal('application/json', res.headers['content-type']);
      test.equal('close', res.headers['connection']);
      //"date":"Wed, 29 May 2013 11:12:39 GMT",
      //"server":"Restlet-Framework/2.1.2.0nodejs2.1",
      //"vary":"Accept-Charset, Accept-Encoding, Accept-Language, Accept",
      res.setEncoding('utf8');
      var data = [];
      res.on('data', function (chunk) {
        data.push(chunk);
      });
      res.on('end', function() {
        test.equal('{\"test\":1,\"param\":\"id\"}', data.join(''));
        test.done();
      });
    });
  },

  'get with html': function (test) {
    var options = utils.createRequestOptions('localhost:8000/test1/id','GET',{'accept':'text/html'});
    utils.executeHttpRequest(test, options, null, function(res) {
      test.equal(200, res.statusCode);
      test.equal('43', res.headers['content-length']);
      test.equal('text/html', res.headers['content-type']);
      test.equal('close', res.headers['connection']);
      //"date":"Wed, 29 May 2013 11:12:39 GMT",
      //"server":"Restlet-Framework/2.1.2.0nodejs2.1",
      //"vary":"Accept-Charset, Accept-Encoding, Accept-Language, Accept",
      res.setEncoding('utf8');
      var data = [];
      res.on('data', function (chunk) {
        data.push(chunk);
      });
      res.on('end', function() {
        test.equal('<html><body>test - param = id</body></html>', data.join(''));
        test.done();
      });
    });
  }
};
