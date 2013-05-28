var ServerCall = new [class Class]([class Call], {
    initialize: function(server) {
    	this.callSuperCstr();
    	var serverAddress = null;
    	var serverPort = -1;
    	if (arguments.length==1) {
        	serverAddress = server.getAddress();
        	serverPort = server.getPort();
    	} else if (arguments.length==2) {
        	serverAddress = arguments[0];
        	serverPort = arguments[1];
    	}

        this.setServerAddress(serverAddress);
        this.setServerPort(serverPort);
        this.hostParsed = false;
    },

    abort: function() {
    	
    },

    complete: function() {

    },

    /*public List<Certificate> getCertificates() {
        return null;
    }

    public String getCipherSuite() {
        return null;
    }*/

    getContentLength: function() {
        return [class HeaderUtils].getContentLength(this.getRequestHeaders());
    },

    getHostDomain: function() {
        if (this.hostParsed==null || !this.hostParsed) {
            this.parseHost();
        }
        //return this.callSuper("getHostDomain");
        return this.hostDomain;
    },

    getHostPort: function() {
        if (this.hostParsed==null || !this.hostParsed) {
            this.parseHost();
        }
        //return this.callSuper("getHostPort");
        return this.hostPort;
    },

    getRequestEntity: function() {
        var result = null;
        var contentLength = this.getContentLength();
        var chunkedEncoding = [class HeaderUtils]
                .isChunkedEncoding(this.getRequestHeaders());
        // In some cases there is an entity without a content-length header
        var connectionClosed = [class HeaderUtils]
                .isConnectionClose(this.getRequestHeaders());

        // Create the representation
        /*if (((contentLength != [class Representation].UNKNOWN_SIZE) && (contentLength != 0))
                || chunkedEncoding || connectionClosed) {
            // Create the result representation
            InputStream requestStream = getRequestEntityStream(contentLength);

            if (connectionClosed) {
                // We need to detect if there is really an entity or not as only
                // the end of connection can let us know at this point
                PushbackInputStream pbi = new PushbackInputStream(requestStream);

                try {
                    int next = pbi.read();

                    if (next != -1) {
                        pbi.unread(next);
                        requestStream = pbi;
                    } else {
                        requestStream = null;
                    }
                } catch (IOException e) {
                    getLogger().fine("Unable to read request entity");
                }
            }

            if (requestStream != null) {
                result = new InputRepresentation(requestStream, null,
                        contentLength);
            } else {
                result = new EmptyRepresentation();
            }

            result.setSize(contentLength);
        } else {
            result = new EmptyRepresentation();
        }*/

        // Extract some interesting header values
        for (var i=0; i<this.getRequestHeaders().length; i++) {
        	var header = this.getRequestHeaders()[i];
            if (header.getName().equalsIgnoreCase(
                    [class HeaderConstants].HEADER_CONTENT_ENCODING)) {
                new [class EncodingReader](header.getValue()).addValues(result
                        .getEncodings());
            } else if (header.getName().equalsIgnoreCase(
            		[class HeaderConstants].HEADER_CONTENT_LANGUAGE)) {
                new [class LanguageReader](header.getValue()).addValues(result
                        .getLanguages());
            } else if (header.getName().equalsIgnoreCase(
            		[class HeaderConstants].HEADER_CONTENT_TYPE)) {
                var contentType = new [class ContentType](header.getValue());
                result.setMediaType(contentType.getMediaType());
                result.setCharacterSet(contentType.getCharacterSet());
            } else if (header.getName().equalsIgnoreCase(
            		[class HeaderConstants].HEADER_CONTENT_RANGE)) {
            	[class RangeReader].update(header.getValue(), result);
            } else if (header.getName().equalsIgnoreCase(
            		[class HeaderConstants].HEADER_CONTENT_MD5)) {
                /*result.setDigest(new Digest(Digest.ALGORITHM_MD5, Base64
                        .decode(header.getValue())));*/
            } else if (header.getName().equalsIgnoreCase(
            		[class HeaderConstants].HEADER_CONTENT_DISPOSITION)) {
                try {
                    result.setDisposition(new [class DispositionReader](header
                            .getValue()).readValue());
                } catch (err) {
                    [class Context].getCurrentLogger().log(
                            [class Level].WARNING,
                            "Error during Content-Disposition header parsing. Header: "
                                    + header.getValue(), err);
                }
            }
        }

        return result;
    },

    /*public Integer getSslKeySize() {
        return null;
    }

    public String getSslSessionId() {
        byte[] byteArray = getSslSessionIdBytes();

        if (byteArray != null) {
            return BioUtils.toHexString(byteArray);
        } else {
            return null;
        }
    }

    protected byte[] getSslSessionIdBytes() {
        return null;
    }*/

    isClientKeepAlive: function() {
        return ![class HeaderUtils].isConnectionClose(this.getRequestHeaders());
    },

    isServerKeepAlive: function() {
        return true;
    },

    parseHost: function() {
        var host = this.getRequestHeaders().getFirstValue(
                [class HeaderConstants].HEADER_HOST, true);

        if (host != null) {
            var colonIndex = host.indexOf(':');

            if (colonIndex != -1) {
                this.setHostDomain(host.substring(0, colonIndex));
                this.setHostPort(parseInt(host
                        .substring(colonIndex + 1)));
            } else {
                this.setHostDomain(host);
                this.setHostPort(getProtocol().getDefaultPort());
            }
        } else {
            /*getLogger().info(
                    "Couldn't find the mandatory \"Host\" HTTP header.");*/
        }

        this.hostParsed = true;
    },

    sendResponse: function(response) {
        if (response != null) {
            // Get the connector service to callback
            var responseEntity = response.getEntity();
            /*ConnectorService connectorService = ConnectorHelper
                    .getConnectorService();

            if (connectorService != null) {
                connectorService.beforeSend(responseEntity);
            }*/

            try {
                this.writeResponseHead(response);

                if (responseEntity != null) {
                    this.writeResponseBody(responseEntity);

                    /*if (responseEntityStream != null) {
                        try {
                            responseEntityStream.flush();
                            responseEntityStream.close();
                        } catch (IOException ioe) {
                            // The stream was probably already closed by the
                            // connector. Probably OK, low message priority.
                            getLogger()
                                    .log(Level.FINE,
                                            "Exception while flushing and closing the entity stream.",
                                            ioe);
                        }
                    }*/
                }
            } catch(err) {
            	console.log(err.stack);
            } finally {
                if (responseEntity != null) {
                    responseEntity.release();
                }

                /*if (connectorService != null) {
                    connectorService.afterSend(responseEntity);
                }*/
            }
        	this.endResponse();
        }
    },

    shouldResponseBeChunked: function(response) {
        return (response.getEntity() != null)
                && !response.getEntity().hasKnownSize();
    },

    writeResponseBody: function(responseEntity) {
        // Send the entity to the client
        /*if (responseEntityStream != null) {
            entity.write(responseEntityStream);
            responseEntityStream.flush();
        }*/
    	this.writeData(responseEntity.getText());
    },

    writeResponseHead: function(response) {
        // We don't support persistent connections yet
        this.getResponseHeaders().set([class HeaderConstants].HEADER_CONNECTION, "close",
                true);

        // Check if 'Transfer-Encoding' header should be set
        if (this.shouldResponseBeChunked(response)) {
            this.getResponseHeaders().add([class HeaderConstants].HEADER_TRANSFER_ENCODING,
                    "chunked");
        }

        // Write the response headers
        for (var i=0; i<this.getResponseHeaders().size(); i++) {
        	var header = this.getResponseHeaders().get(i);
        	this.response.setHeader(header.name, header.value);
        }

    	var reasonPhrase = null;
        if (this.getReasonPhrase() != null) {
        	reasonPhrase = [class StringUtils].getLatin1Bytes(this.getReasonPhrase());
        } else {
        	reasonPhrase = [class StringUtils]
                    .getAsciiBytes(("Status " + this.getStatusCode()));
        }
        this.response.writeHead([class StringUtils].getAsciiBytes(
                this.getStatusCode()), reasonPhrase);
    }
});
