# Restlet Framework

## RESTful web API framework for JavaScript ![project status](http://dl.dropbox.com/u/2208502/maintained.png)

<table>
  <thead>
    <tr>
      <th>Version</th>
      <th>Linux</th>
      <th>OS X</th>
      <th>Windows</th>
      <th>Coverage</th>
      <th>Dependencies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://www.npmjs.org/package/restlet"><img src="https://img.shields.io/npm/v/restlet.svg"></a>
      </td>
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

NOTE: this is a port in progress of the Restlet Framework for Java.

http://restlet.org

## Installing

For Node, use NPM with the following command:

```
npm install restlet
```

For browsers, use Bower with the following command:

```
bower install restlet
```

or get the JavaScript files from folder `browser/dist` from Github.

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
```javascript

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
```

Restlet JS also provides a client support to call REST resources:

```javascript
    var restlet = require('restlet');

    restlet.createClientResource('http://myurl')
      .get({
        accept: 'application/json'
        parameters: [ 'entity' ],
        convertOutputEntity: true },
      function(entity) {
        (...)
      });
```
### Within browsers

Restlet JS also provides a client support to call REST resources with browsers:
```html
    <html>
      <head>
        <script type="text/javascript" src="jquery-2.1.4.min.js"></script>
        <script type="text/javascript" src="lodash.min.js"></script>
        <script type="text/javascript" src="moment-2.10.3.js"></script>
        <script type="text/javascript" src="restlet.min.js"></script>
        <script type="text/javascript">
          $(document).ready(function() {
            $('#test').click(function() {
              restlet.createClientResource('http://localhost:8080/data.json').get({
                accept: 'application/json',
                parameters: [ 'entity' ],
                convertInputEntity: true
              }, function(entity) {
                console.log('>> entity = ' + JSON.stringify(entity));
              });
            });
          });
        </script>
      </head>

      <body>
        <span id="test">Run Restlet client</span>
      </body>
    </html>
```

## Samples applications

Discover simple sample applications in our repository:

* [Browser sample](https://github.com/restlet/restlet-framework-js/tree/master/samples/browser)
* [Node Hello World](https://github.com/restlet/restlet-framework-js/tree/master/samples/node/helloworld)
* [Node Web API](https://github.com/restlet/restlet-framework-js/tree/master/samples/node/webapi)

## Documentation

| Version | Status | Documentation |
| ------- | -------| --------------|
| 0.4.1   | In progress | [Server API Reference](https://github.com/restlet/restlet-framework-js/blob/master/docs/references/doc-server-0.4.1.md) |
| 0.4.1   | In progress | [Client API Reference](https://github.com/restlet/restlet-framework-js/blob/master/docs/references/doc-client-0.4.1.md) |

## Support

If you have questions about the framework and the way to use it, you can ask a question
on the [StackOverflow website](http://stackoverflow.com/questions/tagged/restlet+javascript) using tags `restlet` and `javascript`
or `restlet.js`.

## Contribute

If you want to contribute to the framework, please have a look at this page:
[Contributing to Restlet JS](https://github.com/restlet/restlet-framework-js/blob/master/docs/guides/contribute.md)

## Copyright

Copyright 2015 Restlet, Inc.
