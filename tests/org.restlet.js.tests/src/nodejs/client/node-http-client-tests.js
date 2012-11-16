var http = require("http");

var client = http.createClient(8182, "localhost");
var clientRequest = client.request("PUT", "/contact/1", {});

clientRequest.on('response', function (clientResponse) {
  console.log("response received");
});

var data = "{\"id\":1,\"lastName\":\"test\",\"firstName\":\"test1\"}";
clientRequest.write(data);
clientRequest.end();
