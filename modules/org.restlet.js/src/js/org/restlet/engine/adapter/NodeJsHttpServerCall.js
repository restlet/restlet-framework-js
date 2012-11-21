var NodeJsHttpServerCall = new [class Class]([class ServerCall], {
	initialize: function(server, request, response, confidential) {
    	this.callSuperCstr(server);
		this.server = server;
		this.request = request;
		this.response = response;
		this.requestHeadersAdded = false;
		
		this.parseRequestHeaders();
	},

	parseRequestHeaders: function() {
		var nodeHeaders = this.request.headers;
		var headers = this.getRequestHeaders();
		for (var elt in nodeHeaders) {
			headers.add(elt, nodeHeaders[elt]);
		}
	},
	
	getMethod: function() {
		return this.request.method;
	},
	
	getRequestUri: function() {
		return this.request.url;
	},
	
	/*handleRequest: function(request, response) {
        this.getHelper().handle(
                new SimpleCall(getHelper().getHelped(), request, response,
                        this.getHelper().isConfidential()));

            response.close();
	}*/
	
	writeData: function(data) {
		this.response.write(data);
	},
	
	endResponse: function() {
		this.response.end();
	}
});