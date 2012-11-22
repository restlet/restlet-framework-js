require("should");
var restlet = require('../../index');

describe("JsonRepresentation", function(){
  it("converts json text to object", function(done){
	  var representation = new restlet.representation.Representation();
	  representation.write("{\"id\":\"testid\",\"prop\":{\"name\":\"testname\"}}");
	  var jsonRepresentation = new restlet.representation.JsonRepresentation(representation);
	  var obj = jsonRepresentation.getObject();

      obj.id.should.equal('testid');
      obj.prop.name.should.equal('testname');
      done();
  });
});

describe("JsonRepresentation", function(){
	  it("converts json text to object", function(done){
		  var jsonRepresentation = new restlet.representation.JsonRepresentation(
				  "{\"id\":\"testid\",\"prop\":{\"name\":\"testname\"}}");
		  var obj = jsonRepresentation.getObject();

	      obj.id.should.equal('testid');
	      obj.prop.name.should.equal('testname');
	      done();
	  });
	});

describe("JsonRepresentation", function(){
  it("converts object to json text", function(done){
	  var obj = {id:"testid",prop:{name:"testname"}};
	  var jsonRepresentation = new restlet.representation.JsonRepresentation(obj);
	  var text = jsonRepresentation.getText();

      obj.id.should.equal('testid');
      obj.prop.name.should.equal('testname');
      done();
  });
});