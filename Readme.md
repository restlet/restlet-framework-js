# Restlet Framework

## RESTful web API framework for JavaScript ![project status](http://dl.dropbox.com/u/2208502/maintained.png)

<table>
  <thead>
    <tr>
      <th>Linux</th>
      <th>OS X</th>
      <th>Windows</th>
      <th>Coverage</th>
      <th>Dependencies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" align="center">
        <a href="https://travis-ci.org/restlet/restlet-framework-js"><img src="https://travis-ci.org/restlet/restlet-framework-js.svg"></a>
      </td>
      <td align="center">
        <a href="https://ci.appveyor.com/project/templth/restlet-framework-js"><img src="https://ci.appveyor.com/api/projects/status/qeocly6jag8hkdbu?svg=true"></a>
      </td>
      <td align="center">
        <a href="https://coveralls.io/r/restlet/restlet-framework-js"><img src="https://coveralls.io/repos/restlet/restlet-framework-js/badge.svg" alt="Coverage Status"></a>
      </td>
      <td align="center">
        <a href="https://david-dm.org/"><img src="https://david-dm.org/restlet/restlet-framework-js.svg"></a>
      </td>
    </tr>
  </tbody>
</table>

Do you want to blend your web services, web sites and web clients into unified web applications exposing and consuming RESTful web APIs?
Leverage the open source Restlet Framework and its unique JavaScript API available in two consistent editions: Node.js and Browser/AJAX! 

NOTE: this is a port in progress of the Restlet Framework for Java. See wiki pages for usage instructions.

http://restlet.org

## Installing

For Node, use NPM with the following command:

```
npm install restlet
```

## Getting started

### Within Node applications

Restlet JS follows the same concepts than the Java version. It leverages the following elements:

* __Component__ that integrates the whole engine (server and application)
* __Server__ that makes available the Restlet applications for a specific protocol
* __Application__ that corresponds to the Restlet application itself and allows to define
processing elements for requests
* __Router__ that defines how can server resources will be accessed
* __Server resource__ corresponds to the element to process request

Following code describes how to implement a simple Restlet application using JavaScript
and Node:

    var restlet = require('restlet');

    var component = restlet.createComponent();

    // Add a new HTTP server listening on port 3000.
    component.addServer('http', 3000);

    // Create the sample application.
    var application = restlet.createApplication(function() {
      // Create the application router
      var router = restlet.createRouter();

      // Attach a list element server resource
      router.attach('/contacts/',
        restlet.createServerResource().get(function(request, response) {
          var contacts = [
            {
                id: '1',
                lastName: 'Fielding',
                firstName: 'Roy'
            }
          ];
          response.writeObject(contacts);
          response.end();
        })
        .post({ convertInputEntity: true,
            parameters: [ 'entity', 'response'] }, function(contact, response) {
          // add contact
          (...)

          response.status('201');
          response.end();
        });
      );

      return router;
    });

    // Attach the sample application.
    component.getDefaultHost().attachDefault(application);

    // Start the component.
    component.start();

## Documentation

| Version | Status | Documentation |
| ------- | -------| --------------|
| 0.4.0   | In progress | [API Reference](blob/master/docs/doc-server-0.4.0.md) |

## Copyright

Copyright 2015 Restlet, Inc.
