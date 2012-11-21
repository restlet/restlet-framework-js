var HttpResponse = new [class Class]([class Response], {
    initialize: function(httpCall, request) {
        this.callSuperCstr(request);
    	this.request = request;
        this.serverAdded = false;
        this.httpCall = httpCall;

        // Set the properties
        this.setStatus([class Status].SUCCESS_OK);
    },

    getHeaders: function() {
        return getAttributes().get(
                [class HeaderConstants].ATTRIBUTE_HEADERS);
    },

    getHttpCall: function() {
        return this.httpCall;
    },

    getServerInfo: function() {
        var result = this.callSuper("getServerInfo");

        if (!this.serverAdded) {
            result.setAddress(this.httpCall.getServerAddress());
            result.setAgent([class Engine].VERSION_HEADER);
            result.setPort(this.httpCall.getServerPort());
            this.serverAdded = true;
        }

        return result;
    }
});

HttpResponse.extend({
	addHeader: function(response, headerName, headerValue) {
		if (response instanceof [class HttpResponse]) {
			response.getHeaders().add(headerName, headerValue);
		}
	}
});