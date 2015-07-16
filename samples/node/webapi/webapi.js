'use strict';

var restlet = require('../../../index');
var _ = require('lodash');

var component = restlet.createComponent();

// Add a new HTTP server listening on port 3000.
component.addServer('http', 3000);

// In-memory contact list
var contacts = [
  {
    id: '1',
    lastName: 'test',
    firstName: 'test',
    age: 20
  }
];

// Create the sample application.
var application = restlet.createApplication(function() {
  // Create the application router
  var router = restlet.createRouter();

  // Attach the list server resource
  router.attach('/contacts/',
    restlet.createServerResource()
    // Get contacts
    .get(function(request, response) {
      response.writeObject(contacts);
      response.end();
    })
    // Add contact
    .post({
      parameters: [ 'entity', 'request', 'response' ],
      convertInputEntity: true
    }, function(entity, request, response) {
      contacts.push(entity);
      response.locationRef = request.reference.path + entity.id;
      response.setNoContent();
      response.end();
    })
  );

  // Attach the single server resource
  router.attach('/contacts/{id}',
    restlet.createServerResource()
    // Get contact
    .get({
      parameters: ['pathVariables["id"]', 'response']
    }, function(id, response) {
      var contact = _.find(contacts, { id: id});
      response.writeObject(contact);
      response.end();
    })
    // Update contact
    .put({
      parameters: ['entity', 'pathVariables["id"]', 'response'],
      convertInputEntity: true
    }, function(entity, id, response) {
      var contact = _.find(contacts, { id: id});
      contact.firstName = entity.firstName;
      contact.lastName = entity.lastName;
      contact.age = entity.age;
      response.end();
    })
    // Delete contact
    .delete({ parameters: ['pathVariables["id"]', 'response'] },
        function(id, response) {
      _.remove(contacts, {
        id: id
      });
      response.setNoContent();
      response.end();
    })
  );

  return router;
});

// Attach the sample application.
component.getDefaultHost().attachDefault(application);

// Start the component.
component.start();
