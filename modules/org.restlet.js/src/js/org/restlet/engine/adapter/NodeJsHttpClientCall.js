// [ifdef nodejs] uncomment
//var NodeJsHttpClientCall = new Class({
//	initialize: function() {
//	},
//	sendRequest: function(request, callback) {
//		var currentThis = this;
//		var response = new Response(request);
//		//var url = request.getReference().getUrl();
//		var port = request.getReference().getPort();
//		var host = request.getReference().getHost();
//		var path = request.getReference().getPath();
//		var method = request.getMethod().getName();
//		var clientInfo = request.getClientInfo();
//		console.log("clientInfo = "+clientInfo);
//		var acceptedMediaTypes = clientInfo.getAcceptedMediaTypes();
//		var acceptHeader = "";
//		for (var i=0;i<acceptedMediaTypes.length;i++) {
//			if (i>0) {
//				acceptHeader += ",";
//			}
//			acceptHeader += acceptedMediaTypes[i].getType();
//		}
//		var headers = {};
//		if (acceptHeader!="") {
//			headers["accept"] = acceptHeader;
//		}
//			headers["accept"] = "application/json";
//headers["host"] = "localhost:8080";
//console.log("http://"+host+":"+port+path);
//		var data = "";
//		if (request.getEntity()!=null) {
//			data = request.getEntity().getText();
//		}
//
//		var client = http.createClient(port, host);
//		var clientRequest = client.request(method,
//			path, headers);
//		clientRequest.end();
//
//		clientRequest.on('response', function (clientResponse) {
//			console.log("on response");
//console.log('STATUS: ' + clientResponse.statusCode);
//  console.log('HEADERS: ' + JSON.stringify(clientResponse.headers));
//			var representation = new Representation();
//			//representation.write(xhr);
//			response.setEntity(representation);
//			callback(response);
//			clientResponse.on('data', function (chunk) {
//				console.log("on data");
//				console.log("chunk = "+chunk);
//				representation.write({responseText: chunk, responseXML: null});
//			});
//		});
//	}
//});
// [enddef]