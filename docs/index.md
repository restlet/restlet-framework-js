# Restlet.JS for browsers

## Importing Restlet in the web page

    <script type="text/javascript" src="/js/jsonparser/json-minified.js"></script> 
    <script type="text/javascript" src="/js/restlet/restlet-browser.js"></script> 

## Using Restlet to make requests

This section describes some use cases of Restlet Framework for JavaScript in a browser.

### Executing a simple GET request and getting the result content as String.

    var clientResource = new ClientResource("/contact/1");
    clientResource.get(function(representation) {
        var content = representation.getText();
        (...)
    });

### Executing a simple GET request and getting the result content as object.

Using JSON format for data:

    var clientResource = new ClientResource("/contact/1");
    clientResource.get(function(representation) {
        var jsonRepresentation = new JsonRepresentation(representation);
        var obj = jsonRepresentation.getObject();
        (...)
    });

Using XML format for data:

    var clientResource = new ClientResource("/contact/1");
    clientResource.get(function(representation) {
        var xmlRepresentation = new XmlRepresentation(representation);
        var obj = xmlRepresentation.getObject();
        (...)
    });

### Using content negociation

    var clientResource = new ClientResource("/contact/1");
    clientResource.get(function(representation) {
        var content = representation.getText();
        (...)
    }, MediaType.APPLICATION_JSON);

### Sending content in a simple PUT request

    var clientResource = new ClientResource("/contact/1");
    var contact = {
             id: "1",
             lastName: "lastName",
             firstName: "firstName"
    }
    var jsonRepresentation = new JsonRepresentation(contact);
    clientResource.put(jsonRepresentation, function(representation) {
        var jsonRepresentation = new JsonRepresentation(representation);
        var obj = jsonRepresentation.getObject();
        (...)
    }, MediaType.APPLICATION_JSON);

### Using JSONP to make GET request

    var url= "http://query.yahooapis.com/v1/public/yql";
    var clientResource = new ClientResource(url);
    clientResource.addQueryParameter("q", "select * from weather.forecast where location=10504");
    clientResource.addQueryParameter("format", "json");

    clientResource.get(function(representation) {
        var obj = representation.getObject();
        (...)
    }, MediaType.APPLICATION_JSONP);

In this case, the provided representation to the call is a JsonRepresentation and the response content can be reached through its getObject. Be aware that, when using JSONP, you can't use the header support of Restlet.

# Restlet.JS for NodeJS

## Importing Restlet in your Node application

After having installed Node.js and NPM, install from command line Restlet Framework for JavaScript as described below:

    npm install restlet

## Using Restlet to make requests

This section describes some use cases of Restlet/JS with Node.js regarding client side.

### Executing a simple GET request and getting the result content as String.

    var restlet = require("restlet");
    var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
    clientResource.get(function(representation) {
        var content = representation.getText();
        (...)
    });

### Executing a simple GET request and getting the result content as object.

Using JSON format for data:

    var restlet = require("restlet");
    var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
    clientResource.get(function(representation) {
        var jsonRepresentation = new restlet.representation.JsonRepresentation(representation);
        var obj = jsonRepresentation.getObject();
        (...)
    });

Using XML format for data:

    var restlet = require("restlet");
    var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
    clientResource.get(function(representation) {
        var xmlRepresentation = new restlet.representation.XmlRepresentation(representation);
        var obj = xmlRepresentation.getObject();
        (...)
    });

### Using content negociation

    var restlet = require("restlet");
    var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
    clientResource.get(function(representation) {
        var content = representation.getText();
        (...)
    }, restlet.data.MediaType.APPLICATION_JSON);

### Sending content in a simple PUT request

    var restlet = require("restlet");
    var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
    var contact = {
             id: "1",
             lastName: "lastName",
             firstName: "firstName"
    }
    var jsonRepresentation = new restlet.representation.JsonRepresentation(contact);
    clientResource.put(jsonRepresentation, function(representation) {
        var jsonRepresentation = new restlet.representation.JsonRepresentation(representation);
        var obj = jsonRepresentation.getObject();
        (...)
    }, restlet.representation.MediaType.APPLICATION_JSON);

## Using Restlet to serve requests

This section describes some use cases of Restlet/JS with Node.js regarding server side.

### Create a Restlet component

    var component = new restlet.Component();
    component.getServers().addProtocol(restlet.data.Protocol.HTTP, 8182);
    
    var application = restlet.Application.create(function() {
        //Inbound root
        var router = new restlet.Router();
        (...)
        return router;
    });
    
    component.getDefaultHost().attachDefault(application);
    
    component.start();

### Attach processing for paths

    var application = restlet.Application.create(function() {
        //Inbound root
        var router = new restlet.Router();
        router.attach("/test1/{id}", function(request, response) {
            var attributes = request.getAttributes();
            for (var elt in attributes) {
                console.log("elt = "+elt+" - value = "+attributes[elt]);
            }
            var repr = new restlet.representation.StringRepresentation("<html><body>This is a test!</body></html>");
            response.endWithRepresentation(repr);
        });
        return router;
    });

### Serving JSON content

    router.attach("/test2", function(request, response) {
        var obj = {id:"testid",name:"testname"};
        var repr = new restlet.representation.JsonRepresentation(obj);
        response.endWithRepresentation(repr);
    });

### Serving XML content

Don't forget to install the `xmldom` module.

    var xmldom = require("xmldom");
    
    router.attach("/test3", function(request, response) {
        var doc = new xmldom.DOMParser().parseFromString("<person/>");
        var personElement = doc.documentElement;
        var idElement = doc.createElement("id");
        personElement.appendChild(idElement);
        var textIdElement = doc.createTextNode("testid");
        idElement.appendChild(textIdElement);
        var nameElement = doc.createElement("name");
        personElement.appendChild(nameElement);
        var textNameElement = doc.createTextNode("testname");
        nameElement.appendChild(textNameElement);

        var repr = new restlet.representation.DomRepresentation(doc);
        response.endWithRepresentation(repr);
    });

### Using Jade templates

Example of processing using the JadeRepresentation class:

    router.attach("/test1/{id}", function(request, response) {
        var model = {
            title: "A title",
            message: "A message"
        };
        var repr = new restlet.representation.JadeRepresentation(
                          "./templates/test.jade", model, restlet.data.MediaType.TEXT_HTML);
        response.endWithRepresentation(repr);
    });

Example of corresponding Jade template:

    doctype 5
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
      body
        h1= title
        p Welcome to #{title}
        p= message

### Using asynchronous processing

    router.attach("/test1/{id}", function(request, response) {
        pg.connect(conString, function(err, client) {
            client.query("select id, firstName, lastName from contacts", function(err, result) {
                var repr = new restlet.representation.JsonRepresentation(result.rows);
                response.endWithRepresentation(repr);
            });
        });
    });

### Using asynchronous processing with Jade templates

Example of processing using the JadeRepresentation class:

    router.attach("/test1/{id}", function(request, response) {
        pg.connect(conString, function(err, client) {
            client.query("select id, firstName, lastName from contacts", function(err, result) {
                var model = {
                    title: "List of contacts",
                    contacts: result.rows
                };
                var repr = new restlet.representation.JadeRepresentation(
                          "./templates/contacts.jade", model, restlet.data.MediaType.TEXT_HTML);
                response.endWithRepresentation(repr);
            });
        });
    });

Example of corresponding Jade template:

    doctype 5
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
      body
        h1= title
        ul
          each contact in contacts
            li #{contact.id} - #{contact.firstName} #{contact.lastName}
