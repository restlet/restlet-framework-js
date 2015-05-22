exports = module.exports;

var testUtils = exports;

testUtils.createRawRequest = function(headers) {
  return {
    headers: headers,
    connection: {
      remoteAddress: 'localhost',
      remotePort: '35034'
    }
  };
}

