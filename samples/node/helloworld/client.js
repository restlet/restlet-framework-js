var restlet = require('../../../index');

restlet.createClientResource('http://localhost:3000/contacts/')
.get({
  accept: 'application/yaml',
  parameters: [ 'entity' ],
  convertInputEntity: true,
  queryParameters: {
    test1: 'test value1',
    test2: 'test value2'
  }
}, function(entity) {
  console.log('>> entity = ' + JSON.stringify(entity));
})
.post({
  id: '4',
  lastName: 'ln1',
  firstName: 'fn1',
  age: 111
}, {
  accept: 'application/yaml',
  mediaType: 'application/json',
  parameters: [ 'response' ],
  convertOutputEntity: true,
  queryParameters: {
    test1: 'test value1',
    test2: 'test value2'
  }
}, function(response) {
  console.log('>> received response');
});