var NodeJsHttpClientCall = new [class Class]([class ClientCall], {
	initialize: function() {
		this.callSuper();
	},
	extractResponseHeaders: function(clientResponse) {
		var headers = [];
		for (var headerName in clientResponse.headers) {
			var header = new [class Parameter](
							headerName,
							clientResponse.headers[headerName]);
			headers.push(header);
		}
		this.setResponseHeaders(headers);
	},
	sendRequest: function(request, callback) {
		var url = request.getResourceRef().toString(true, true);
		var method = request.getMethod().getName();
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		var requestHeaders = {};
		for (var i=0; i<this.requestHeaders.length; i++) {
			var requestHeader = this.requestHeaders[i];
			requestHeaders[requestHeader.getName()] = requestHeader.getValue();
		}
		var data = "";
		if (request.getEntity()!=null) {
			data = request.getEntity().getText();
		}
		var debugHandler = [class Engine].getInstance().getDebugHandler();
		if (debugHandler!=null && debugHandler.beforeSendingRequest!=null) {
			debugHandler.beforeSendingRequest(url, method, requestHeaders, data);
		}

		var currentThis = this;
		var response = new [class Response](request);
		var port = request.getResourceRef().getHostPort();
		var host = request.getResourceRef().getHostDomain();
		var path = request.getResourceRef().getPath();

		var requestOptions = {
			host: host,
			port: port,
			path: path,
			method: method,
			headers: requestHeaders
		};
		var clientRequest = http.request(requestOptions);
		
		clientRequest.on("response", function (clientResponse) {
			currentThis.extractResponseHeaders(clientResponse);

			var repr = new [class Representation]();
			repr = HeaderUtils.extractEntityHeaders(
								currentThis.getResponseHeaders(), repr);
			clientResponse.on('data', function (chunk) {
				repr.write({responseText: chunk, responseXML: null});
			});
			clientResponse.on('end', function (chunk) {
				if (debugHandler!=null && debugHandler.afterReceivedResponse!=null) {
					var responseHeaders = {};
					for (var i=0; i<currentThis.responseHeaders.length; i++) {
						var header = currentThis.responseHeaders[i];
						responseHeaders[header.getName()] = header.getValue();
					}
					debugHandler.afterReceivedResponse(clientResponse.statusCode, "", responseHeaders, repr.getText());
				}
				callback(response);
			});
			//TODO: fix me!
			/*var status = new [class Status](clientResponse.statusCode, null);
			response.setStatus(status);*/
			response.setEntity(repr);
		});

		//TODO: problem with the write method on Restlet server side 
		if (data!=null && data!="") {
			//TODO: support chunking
			//TODO: support encoding
			clientRequest.write(data);
		}// else {
		clientRequest.end();
		//}
	}
});