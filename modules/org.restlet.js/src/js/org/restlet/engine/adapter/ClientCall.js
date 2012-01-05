var ClientCall = new Class(Call, {
	getResponseEntity: function(response) {
		console.log("> getResponseEntity");
        var result = response.getEntity();
        //TODO:
        // boolean available = false;
        var size = Representation.UNKNOWN_SIZE;

        // Compute the content length
        var responseHeaders = this.getResponseHeaders();
        console.log("responseHeaders = "+responseHeaders);
        /*var transferEncoding = responseHeaders.getFirstValue(
                HeaderConstants.HEADER_TRANSFER_ENCODING, true);
        if ((transferEncoding != null)
                && !"identity".equalsIgnoreCase(transferEncoding)) {
            size = Representation.UNKNOWN_SIZE;
        } else {
            size = getContentLength();
        }*/

        /*if (!getMethod().equals(Method.HEAD.getName())
                && !response.getStatus().isInformational()
                && !response.getStatus()
                        .equals(Status.REDIRECTION_NOT_MODIFIED)
                && !response.getStatus().equals(Status.SUCCESS_NO_CONTENT)
                && !response.getStatus().equals(Status.SUCCESS_RESET_CONTENT)) {
            // Make sure that an InputRepresentation will not be instantiated
            // while the stream is closed.
            InputStream stream = getUnClosedResponseEntityStream(getResponseEntityStream(size));
            // [ifndef gwt] line
            java.nio.channels.ReadableByteChannel channel = getResponseEntityChannel(size);
            // [ifdef gwt] line uncomment
            // InputStream channel = null;

            if (stream != null) {
                result = getRepresentation(stream);
            } else if (channel != null) {
                result = getRepresentation(channel);
            }
        }*/

        if (result != null) {
            result.setSize(size);

            // Informs that the size has not been specified in the header.
            if (size == Representation.UNKNOWN_SIZE) {
                /*getLogger()
                        .fine("The length of the message body is unknown. The entity must be handled carefully and consumed entirely in order to surely release the connection.");*/
            }
        }
        console.log("responseHeaders = "+responseHeaders.length);
        result = HeaderUtils.extractEntityHeaders(responseHeaders, result);

        return result;
    }
});