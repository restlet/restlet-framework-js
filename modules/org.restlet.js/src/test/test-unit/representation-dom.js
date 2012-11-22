require("should");
var xmldom = require("xmldom");
var restlet = require('../../index');

//see https://github.com/jindw/xmldom

describe("DomRepresentation", function(){
  it("converts xml text to document", function(done){
	  var representation = new restlet.representation.Representation();
	  representation.write("<person><id>testid</id><prop><name>testname</name></prop></person>");
	  var jsonRepresentation = new restlet.representation.DomRepresentation(representation);
	  var doc = jsonRepresentation.getXml();
	  var rootElement = doc.documentElement;

      rootElement.nodeName.should.equal("person");
      var children = rootElement.childNodes;
      children.should.have.length(2);
      var child1 = children.item(0);
      child1.nodeName.should.equal("id");
      var child11 = child1.childNodes.item(0);
      child11.nodeValue.should.equal("testid");
      var child2 = children.item(1);
      child2.nodeName.should.equal("prop");
      var children2 = child2.childNodes;
      children2.should.have.length(1);
      var child21 = children2.item(0);
      child21.nodeName.should.equal("name");
      var child211 = child21.childNodes.item(0);
      child211.nodeValue.should.equal("testname");
      
      done();
  });
});

describe("DomRepresentation", function(){
  it("converts document to xml text", function(done){
	  var doc = new xmldom.DOMParser().parseFromString("<person/>");
	  var personElement = doc.documentElement;

	  var idElement = doc.createElement("id");
	  personElement.appendChild(idElement);
	  var textIdElement = doc.createTextNode("testid");
	  idElement.appendChild(textIdElement);
	  
	  var propElement = doc.createElement("prop");
	  personElement.appendChild(propElement);
	  var nameElement = doc.createElement("name");
	  propElement.appendChild(nameElement);
	  var textNameElement = doc.createTextNode("testname");
	  nameElement.appendChild(textNameElement);
	  
	  var domRepresentation = new restlet.representation.DomRepresentation(doc);
	  var text = domRepresentation.getText();
	  text.should.equal("<person><id>testid</id><prop><name>testname</name></prop></person>");
	  
      done();
  });
});