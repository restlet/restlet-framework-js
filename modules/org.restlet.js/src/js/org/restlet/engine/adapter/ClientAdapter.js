var ClientAdapter = new Class({
	initialize: function(context) {
		
	},
    readResponseHeaders: function(httpCall, response) {
    	console.log("readResponseHeaders");
        try {
            var responseHeaders = httpCall.getResponseHeaders();
        	console.log("responseHeaders = "+responseHeaders.length);

            // Put the response headers in the call's attributes map
        	console.log("response = "+response);
        	console.log("response = "+response.getAttributes);
        	console.log("response = "+response.getAttributes());
            response.getAttributes()[HeaderConstants.ATTRIBUTE_HEADERS] = responseHeaders;

            HeaderUtils.copyResponseTransportHeaders(responseHeaders, response);
        } catch (err) {
        	console.log(err);
            response.setStatus(Status.CONNECTOR_ERROR_INTERNAL, err);
        }
    },
    toSpecific: function(client, request) {
        // Create the low-level HTTP client call
        var result = client.create(request);

        // Add the headers
        if (result != null) {
            HeaderUtils.addGeneralHeaders(request, result.getRequestHeaders());

            if (request.getEntity() != null) {
                HeaderUtils.addEntityHeaders(request.getEntity(),
                        result.getRequestHeaders());
            }

            // NOTE: This must stay at the end because the AWS challenge
            // scheme requires access to all HTTP headers
            HeaderUtils.addRequestHeaders(request, result.getRequestHeaders());
        }

        return result;
    },
    updateResponse: function(response, status, httpCall) {
    	console.log("updateResponse");
        // Send the request to the client
        response.setStatus(status);

        // Get the server address
        //TODO:
        //response.getServerInfo().setAddress(httpCall.getServerAddress());
        //response.getServerInfo().setPort(httpCall.getServerPort());

        // Read the response headers
        this.readResponseHeaders(httpCall, response);

        // Set the entity
        response.setEntity(httpCall.getResponseEntity(response));

        // Release the representation's content for some obvious cases
        if (response.getEntity() != null) {
            if (response.getEntity().getSize() == 0) {
                response.getEntity().release();
            } else if (response.getRequest().getMethod().equals(Method.HEAD)) {
                response.getEntity().release();
            } else if (response.getStatus().equals(Status.SUCCESS_NO_CONTENT)) {
                response.getEntity().release();
            } else if (response.getStatus()
                    .equals(Status.SUCCESS_RESET_CONTENT)) {
                response.getEntity().release();
                response.setEntity(null);
            } else if (response.getStatus().equals(
                    Status.REDIRECTION_NOT_MODIFIED)) {
                response.getEntity().release();
            } else if (response.getStatus().isInformational()) {
                response.getEntity().release();
                response.setEntity(null);
            }
        }
    },
    commit: function(httpCall, request, callback) {
        if (httpCall != null) {
            // Send the request to the client
        	var currentThis = this;
            httpCall.sendRequest(request, function(response) {
                try {
                	currentThis.updateResponse(response,
                            new Status(httpCall.getStatusCode(), null,
                                    httpCall.getReasonPhrase(), null),
                            httpCall);
                    callback(response);
                } catch (err) {
                	console.log(err);
                    // Unexpected exception occurred
                    if ((response.getStatus() == null)
                            || !response.getStatus().isError()) {
                        response.setStatus(
                                Status.CONNECTOR_ERROR_INTERNAL, err);
                        callback(response);
                    }
                }
            });
        }
    }
});