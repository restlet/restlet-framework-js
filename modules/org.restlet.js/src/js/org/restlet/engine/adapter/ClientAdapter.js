var ClientAdapter = new [class Class]({
	initialize: function(context) {
	},
    readResponseHeaders: function(httpCall, response) {
        try {
            var responseHeaders = httpCall.getResponseHeaders();

            // Put the response headers in the call's attributes map
            response.getAttributes()[HeaderConstants.ATTRIBUTE_HEADERS] = responseHeaders;

           [class HeaderUtils].copyResponseTransportHeaders(responseHeaders, response);
        } catch (err) {
            response.setStatus([class Status].CONNECTOR_ERROR_INTERNAL, err);
        }
    },
    toSpecific: function(client, request) {
        // Create the low-level HTTP client call
        var result = client.create(request);

        // Add the headers
        if (result != null) {
        	[class HeaderUtils].addGeneralHeaders(request, result.getRequestHeaders());

            if (request.getEntity() != null) {
            	[class HeaderUtils].addEntityHeaders(request.getEntity(),
                        result.getRequestHeaders());
            }

            // NOTE: This must stay at the end because the AWS challenge
            // scheme requires access to all HTTP headers
            [class HeaderUtils].addRequestHeaders(request, result.getRequestHeaders());
        }

        return result;
    },
    updateResponse: function(response, status, httpCall) {
        // Send the request to the client
        response.setStatus(status);

        // Get the server address
        response.getServerInfo().setAddress(httpCall.getServerAddress());
        response.getServerInfo().setPort(httpCall.getServerPort());

    	// Read the response headers
        this.readResponseHeaders(httpCall, response);

    	// Set the entity
        response.setEntity(httpCall.getResponseEntity(response));

        // Release the representation's content for some obvious cases
        if (response.getEntity() != null) {
            if (response.getEntity().getSize() == 0) {
                response.getEntity().release();
            } else if (response.getRequest().getMethod()==[class Method].HEAD) {
                response.getEntity().release();
            } else if (response.getStatus()==[class Status].SUCCESS_NO_CONTENT) {
                response.getEntity().release();
            } else if (response.getStatus()
                    ==[class Status].SUCCESS_RESET_CONTENT) {
                response.getEntity().release();
                response.setEntity(null);
            } else if (response.getStatus()==
            	[class Status].REDIRECTION_NOT_MODIFIED) {
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
                            new [class Status](httpCall.getStatusCode(), null,
                                    httpCall.getReasonPhrase(), null),
                            httpCall);
                    callback(response);
                } catch (err) {
                    // Unexpected exception occurred
                    if ((response.getStatus() == null)
                            || !response.getStatus().isError()) {
                        response.setStatus(
                        		[class Status].CONNECTOR_ERROR_INTERNAL, err);
                        callback(response);
                    }
                }
            });
        }
    }
});