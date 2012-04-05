var ClientCall = new [class Class]([class Call], {
	initialize: function() {
		//TODO: fix recursive callSuper bug
		//this.callSuper();
		this.requestHeaders = [];
		this.responseHeaders = [];
	},
	getContentLength: function() {
		return HeaderUtils.getContentLength(this.getResponseHeaders());
	},
	getResponseEntity: function(response) {
        var result = response.getEntity();
        var size = [class Representation].UNKNOWN_SIZE;

        // Compute the content length
        var responseHeaders = this.getResponseHeaders();
        var transferEncoding = responseHeaders.getFirstValue(
        			[class HeaderConstants].HEADER_TRANSFER_ENCODING, true);
        if ((transferEncoding != null)
        		&& !"identity".equalsIgnoreCase(transferEncoding)) {
        	size = [class Representation].UNKNOWN_SIZE;
        } else {
        	size = this.getContentLength();
        }

        if (!this.getMethod().equals(Method.HEAD)
                && !response.getStatus().isInformational()
                && !response.getStatus().equals([class Status].REDIRECTION_NOT_MODIFIED)
                && !response.getStatus().equals([class Status].SUCCESS_NO_CONTENT)
                && !response.getStatus().equals([class Status].SUCCESS_RESET_CONTENT)) {
        	result = response.getEntity();
        }

        if (result != null) {
            result.setSize(size);

            // Informs that the size has not been specified in the header.
            if (size == [class Representation].UNKNOWN_SIZE) {
                /*getLogger()
                        .fine("The length of the message body is unknown. The entity must be handled carefully and consumed entirely in order to surely release the connection.");*/
            }
        }
        result = [class HeaderUtils].extractEntityHeaders(responseHeaders, result);

        return result;
    }
});