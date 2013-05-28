var ServerAdapter = new [class Class]([class Adapter], {
    initialize: function(context) {
        this.callSuperCstr(context);
    },

    addEntityHeaders: function(response) {
        var responseHeaders = response.getHttpCall()
                .getResponseHeaders();
        var entity = response.getEntity();
        [class HeaderUtils].addEntityHeaders(entity, responseHeaders);
    },

    addResponseHeaders: function(response) {
        try {
            // Add all the necessary headers
            [class HeaderUtils].addGeneralHeaders(response, response.getHttpCall()
                    .getResponseHeaders());
            [class HeaderUtils].addResponseHeaders(response, response.getHttpCall()
                    .getResponseHeaders());

            // Set the status code in the response
            if (response.getStatus() != null) {
                response.getHttpCall().setStatusCode(
                        response.getStatus().getCode());
                response.getHttpCall().setReasonPhrase(
                        response.getStatus().getReasonPhrase());
            }
        } catch (err) {
        	console.log(err.stack);
            this.getLogger().log([class Level].INFO,
                    "Exception intercepted while adding the response headers",
                    err);
            response.getHttpCall().setStatusCode(
                    [class Status].SERVER_ERROR_INTERNAL.getCode());
            response.getHttpCall().setReasonPhrase(
                    [class Status].SERVER_ERROR_INTERNAL.getReasonPhrase());
        }
    },

    commit: function(response) {
        try {
            if ((response.getRequest().getMethod() != null)
                    && response.getRequest().getMethod().equals([class Method].HEAD)) {
                this.addEntityHeaders(response);
                response.setEntity(null);
            } else if ([class Method].GET.equals(response.getRequest().getMethod())
                    && [class Status].SUCCESS_OK.equals(response.getStatus())
                    && (!response.isEntityAvailable())) {
                this.addEntityHeaders(response);
                this.getLogger()
                        .warning(
                                "A response with a 200 (Ok) status should have an entity. Make sure that resource \""
                                        + response.getRequest()
                                                .getResourceRef()
                                        + "\" returns one or sets the status to 204 (No content).");
            } else if (response.getStatus().equals([class Status].SUCCESS_NO_CONTENT)) {
                this.addEntityHeaders(response);

                if (response.isEntityAvailable()) {
                    this.getLogger()
                            .fine("Responses with a 204 (No content) status generally don't have an entity. Only adding entity headers for resource \""
                                    + response.getRequest().getResourceRef()
                                    + "\".");
                    response.setEntity(null);
                }
            } else if (response.getStatus()
                    .equals([class Status].SUCCESS_RESET_CONTENT)) {
                if (response.isEntityAvailable()) {
                    this.getLogger()
                            .warning(
                                    "Responses with a 205 (Reset content) status can't have an entity. Ignoring the entity for resource \""
                                            + response.getRequest()
                                                    .getResourceRef() + "\".");
                    response.setEntity(null);
                }
            } else if (response.getStatus().equals(
                    [class Status].REDIRECTION_NOT_MODIFIED)) {
                if (response.getEntity() != null) {
                    [class HeaderUtils].addNotModifiedEntityHeaders(response
                            .getEntity(), response.getHttpCall()
                            .getResponseHeaders());
                    response.setEntity(null);
                }
            } else if (response.getStatus().isInformational()) {
                if (response.isEntityAvailable()) {
                    this.getLogger()
                            .warning(
                                    "Responses with an informational (1xx) status can't have an entity. Ignoring the entity for resource \""
                                            + response.getRequest()
                                                    .getResourceRef() + "\".");
                    response.setEntity(null);
                }
            } else {
                this.addEntityHeaders(response);

                if (!response.isEntityAvailable()) {
                    if ((response.getEntity() != null)
                            && (response.getEntity().getSize() != 0)) {
                        this.getLogger()
                                .warning(
                                        "A response with an unavailable and potentially non empty entity was returned. Ignoring the entity for resource \""
                                                + response.getRequest()
                                                        .getResourceRef()
                                                + "\".");
                    }

                    response.setEntity(null);
                }
            }

            // Add the response headers
            this.addResponseHeaders(response);

            // Send the response to the client
            response.getHttpCall().sendResponse(response);
        } catch (err) {
        	console.log(err.stack);
            // [ifndef gae]
            /*if (response.getHttpCall().isConnectionBroken(t)) {
                getLogger()
                        .log(Level.INFO,
                                "The connection was broken. It was probably closed by the client.",
                                t);
            } else
            // [enddef]
            {
                getLogger().log(Level.SEVERE,
                        "An exception occured writing the response entity", t);
                response.getHttpCall().setStatusCode(
                        Status.SERVER_ERROR_INTERNAL.getCode());
                response.getHttpCall().setReasonPhrase(
                        "An exception occured writing the response entity");
                response.setEntity(null);

                try {
                    response.getHttpCall().sendResponse(response);
                } catch (IOException ioe) {
                    getLogger().log(Level.WARNING,
                            "Unable to send error response", ioe);
                }
            }*/
        } finally {
            response.getHttpCall().complete();

            /*if (response.getOnSent() != null) {
                response.getOnSent().handle(response.getRequest(), response);
            }*/
        }
    },

    toRequest: function(httpCall) {
        var result = new [class HttpRequest](this.getContext(), httpCall);
        result.getAttributes()[[class HeaderConstants].ATTRIBUTE_HEADERS] =
                httpCall.getRequestHeaders();

        if (httpCall.getVersion() != null) {
            result.getAttributes()[[class HeaderConstants].ATTRIBUTE_VERSION] =
                    httpCall.getVersion();
        }

        /*if (httpCall.isConfidential()) {
            List<Certificate> clientCertificates = httpCall.getCertificates();

            if (clientCertificates != null) {
                result.getAttributes().put(
                        HeaderConstants.ATTRIBUTE_HTTPS_CLIENT_CERTIFICATES,
                        clientCertificates);
                result.getClientInfo().setCertificates(clientCertificates);
            }

            String cipherSuite = httpCall.getCipherSuite();

            if (cipherSuite != null) {
                result.getAttributes().put(
                        HeaderConstants.ATTRIBUTE_HTTPS_CIPHER_SUITE,
                        cipherSuite);
                result.getClientInfo().setCipherSuite(cipherSuite);
            }

            Integer keySize = httpCall.getSslKeySize();

            if (keySize != null) {
                result.getAttributes().put(
                        HeaderConstants.ATTRIBUTE_HTTPS_KEY_SIZE, keySize);
            }

            String sslSessionId = httpCall.getSslSessionId();

            if (sslSessionId != null) {
                result.getAttributes().put(
                        HeaderConstants.ATTRIBUTE_HTTPS_SSL_SESSION_ID,
                        sslSessionId);
            }
        }*/

        return result;
    },
});
