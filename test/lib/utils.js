var http = require("http");

module.exports = {
  createRequestOptions: function(url, method, headers) {
    var index = -1;
    var hostname = '';
    var port = 80;
    var path = '';
    if ((index=url.indexOf(":"))!=-1) {
      hostname = url.substring(0,index);
      url = url.substring(index+1);
      if ((index=url.indexOf("/"))!=-1) {
        port = parseInt(url.substring(0, index));
        path = url.substring(index);
      }
    } else {
      if ((index=url.indexOf("/"))!=-1) {
        hostname = url.substring(0,index);
        path = url.substring(index);
      }
    }

    return {
      hostname: hostname,
      port: port,
	  path: path,
	  method: method,
	  headers: headers
    };
  },

  executeHttpRequest: function(test, options, data, callback) {
    var req = http.request(options, callback);

    req.on('error', function(e) {
      test.ifError(e);
      test.done();
    });

    if (data!=null) {
      req.write(data);
    }
    req.end();
  }
};

