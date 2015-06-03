var restlet = require('../../index');
var _ = require('lodash');

var component = restlet.createComponent();

// Add a new HTTP server listening on port 3000.
component.addServer('http', 3000);

// Create the sample application.
var application = restlet.createApplication(function() {
  // Create the application router
  var router = restlet.createRouter();

  // Attach a server resource
  router.attach('/helloworld',
    restlet.createServerResource().getJson(function() {
      response.writeObject({message: 'hello world'});
      response.end();
    })
  );

  return router;
});

// Attach the sample application.
component.getDefaultHost().attachDefault(application);

// Start the component.
component.start();