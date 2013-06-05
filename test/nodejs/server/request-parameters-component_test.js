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
    	var param1 = this.getQueryValue("param1");
    	var param2 = this.getQueryValue("param2");
        var repr = new restlet.representation.StringRepresentation("{\"param1\":\""+param1+"\",\"param2\":\""+param2+"\"}", restlet.data.MediaType.APPLICATION_JSON);
        //console.log("> commit");
        this.commit(repr);
        //console.log("< commit");
      });
      router.attach("/test", r1);
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
 
  'get with json and simple parameters': function (test) {
    var options = utils.createRequestOptions('localhost:8000/test?param1=10&param2=11','GET',{});
    utils.executeHttpRequest(test, options, null, function(res) {
      test.equal(200, res.statusCode);
      test.equal('29', res.headers['content-length']);
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
        test.equal('{\"param1\":"10",\"param2\":\"11\"}', data.join(''));
        test.done();
      });
    });
  },
};
