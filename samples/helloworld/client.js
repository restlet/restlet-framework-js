var restlet = require('../../index');

restlet.createClientResource('http://localhost:3000/contacts/')
.get(function(request, response) {
  console.log('>> response.entity.text = ' + response.entity.text);
});