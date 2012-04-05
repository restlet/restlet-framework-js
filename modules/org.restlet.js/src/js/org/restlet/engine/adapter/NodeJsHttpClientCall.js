var NodeJsHttpClientCall = new [class Class]([class ClientCall], {
	initialize: function() {
		this.callSuper();
	},
	sendRequest: function(request, callback) {
		console.log("> NodeJsHttpClientCall.sendRequest")
		var currentThis = this;
		var response = new [class Response](request);
		//var url = request.getReference().getUrl();
		var port = request.getReference().getPort();
		var host = request.getReference().getHost();
		var path = request.getReference().getPath();
		var method = request.getMethod().getName();
		console.log("method = "+method);
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		console.log("clientInfo = "+clientInfo);
		var acceptedMediaTypes = clientInfo.getAcceptedMediaTypes();
		var acceptHeader = "";
		for (var i=0;i<acceptedMediaTypes.length;i++) {
			if (i>0) {
				acceptHeader += ",";
			}
			acceptHeader += acceptedMediaTypes[i].getType();
		}
		var headers = {};
		/*if (acceptHeader!="") {
			headers["accept"] = acceptHeader;
		}
			headers["accept"] = "application/json";
headers["host"] = "localhost:8080";
console.log("http://"+host+":"+port+path);*/
		var requestHeaders = this.getRequestHeaders();
		console.log("requestHeaders.length = "+requestHeaders.length);
		for (var cpt=0; cpt<requestHeaders.length; cpt++) {
			var header = requestHeaders[cpt];
			headers[header.getName()] = header.getValue();
		}
		
		var data = "";
		if (request.getEntity()!=null) {
			data = request.getEntity().getText();
		}

		var client = http.createClient(port, host);
		var clientRequest = client.request(method, path, headers);
		clientRequest.end();

		clientRequest.on('response', function (clientResponse) {
			console.log("on response");
console.log('STATUS: ' + clientResponse.statusCode);
			currentThis.statusCode = clientResponse.statusCode;
			currentThis.reasonPhrase = null;
			console.log("currentThis.status = "+currentThis.status);
			currentThis.serverAddress = host;
			currentThis.serverPort = port;
console.log('HEADERS: ' + JSON.stringify(clientResponse.headers));
			currentThis.responseHeaders = [];
			for (var headerName in clientResponse.headers) {
				currentThis.responseHeaders.push(new Parameter(
						headerName, clientResponse.headers[headerName]));
			}
			var representation = new [class Representation]();
			response.setEntity(representation);
			clientResponse.on('data', function (chunk) {
				console.log("on data");
				console.log("chunk = "+chunk);
				representation.write({responseText: chunk, responseXML: null});
			});
			clientResponse.on('end', function (chunk) {
				console.log("on end");
				callback(response);
			});
		});
	}
});