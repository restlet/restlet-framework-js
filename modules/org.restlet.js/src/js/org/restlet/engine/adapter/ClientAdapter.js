var ClientAdapter = new Class({
	initialize: function(context) {
	},
    readResponseHeaders: function(httpCall, response) {
    	console.log("> readResponseHeaders");
        try {
            var responseHeaders = httpCall.getResponseHeaders();

            // Put the response headers in the call's attributes map
            response.getAttributes()[HeaderConstants.ATTRIBUTE_HEADERS] = responseHeaders;

            HeaderUtils.copyResponseTransportHeaders(responseHeaders, response);
        } catch (err) {
        	console.log(err);
            response.setStatus(Status.CONNECTOR_ERROR_INTERNAL, err);
        }
    	console.log("< readResponseHeaders");
    },
    toSpecific: function(client, request) {
    	console.log("> toSpecific");
        // Create the low-level HTTP client call
        var result = client.create(request);
        console.log("result = "+result);
        console.log("result request headers = "+result.getRequestHeaders());
        console.log("result response headers = "+result.getResponseHeaders());

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

    	console.log("< toSpecific");
        return result;
    },
    updateResponse: function(response, status, httpCall) {
    	console.log("> updateResponse");
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
            } else if (response.getRequest().getMethod()==Method.HEAD) {
                response.getEntity().release();
            } else if (response.getStatus()==Status.SUCCESS_NO_CONTENT) {
                response.getEntity().release();
            } else if (response.getStatus()
                    ==Status.SUCCESS_RESET_CONTENT) {
                response.getEntity().release();
                response.setEntity(null);
            } else if (response.getStatus()==
                    Status.REDIRECTION_NOT_MODIFIED) {
                response.getEntity().release();
            } else if (response.getStatus().isInformational()) {
                response.getEntity().release();
                response.setEntity(null);
            }
        }
    	console.log("< updateResponse");
    },
    commit: function(httpCall, request, callback) {
    	console.log("> commit");
        if (httpCall != null) {
            // Send the request to the client
        	var currentThis = this;
            httpCall.sendRequest(request, function(response) {
                try {
                	console.log("internal callback");
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
    	console.log("< commit");
    }
});