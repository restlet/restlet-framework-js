var HostRoute = new [class Class]([class Route], {
	initialize: function(router, target) {
        this.callSuperCstr(router, target);
    },

    beforeHandle: function(request, response) {
        if (request.getHostRef() == null) {
            request.getResourceRef().setBaseRef(
                    request.getResourceRef().getHostIdentifier());
        } else {
            request.getResourceRef().setBaseRef(request.getHostRef());
        }

        /*if (request.isLoggable() && getLogger().isLoggable(Level.FINE)) {
            getLogger().fine(
                    "Base URI: \"" + request.getResourceRef().getBaseRef()
                            + "\". Remaining part: \""
                            + request.getResourceRef().getRemainingPart()
                            + "\"");
        }*/

        return [class Filter].CONTINUE;
    },

    getVirtualHost: function() {
        return this.getNext();
    },

    //TODO: use JS regexp
    matches: function(regex, formattedString) {
        /*return Pattern.compile(regex, Pattern.CASE_INSENSITIVE)
                .matcher(formattedString).matches();*/
        return new RegExp(regex).test(formattedString);
    },

    score: function(request, response) {
        var result = 0;

        // Prepare the value to be matched
        var hostDomain = "";
        var hostPort = "";
        var hostScheme = "";

        if (request.getHostRef() != null) {
            hostDomain = request.getHostRef().getHostDomain();

            if (hostDomain == null) {
                hostDomain = "";
            }

            var basePortValue = request.getHostRef().getHostPort();

            if (basePortValue == -1) {
                basePortValue = request.getHostRef().getSchemeProtocol()
                        .getDefaultPort();
            }

            hostPort = basePortValue.toString();

            hostScheme = request.getHostRef().getScheme();

            if (hostScheme == null) {
                hostScheme = "";
            }
        }

        if (request.getResourceRef() != null) {
            var resourceDomain = request.getResourceRef().getHostDomain();

            if (resourceDomain == null) {
                resourceDomain = "";
            }

            var resourcePortValue = request.getResourceRef().getHostPort();

            if (resourcePortValue == -1) {
                resourcePortValue = request.getResourceRef()
                        .getSchemeProtocol().getDefaultPort();
            }

            var resourcePort = resourcePortValue.toString();
            var resourceScheme = request.getResourceRef().getScheme();

            if (resourceScheme == null) {
                resourceScheme = "";
            }

            var serverAddress = response.getServerInfo().getAddress();

            if (serverAddress == null) {
                serverAddress = "";
            }

            var serverPortValue = response.getServerInfo().getPort();

            if (serverPortValue == -1) {
                serverPortValue = request.getProtocol().getDefaultPort();
            }

            var serverPort = response.getServerInfo()
                    .getPort().toString();

            // Check if all the criteria match
            if (this.matches(this.getVirtualHost().getHostDomain(), hostDomain)
                    && this.matches(this.getVirtualHost().getHostPort(), hostPort)
                    && this.matches(this.getVirtualHost().getHostScheme(), hostScheme)
                    && this.matches(this.getVirtualHost().getResourceDomain(),
                            resourceDomain)
                    && this.matches(this.getVirtualHost().getResourcePort(), resourcePort)
                    && this.matches(this.getVirtualHost().getResourceScheme(),
                            resourceScheme)
                    && this.matches(this.getVirtualHost().getServerAddress(),
                            serverAddress)
                    && this.matches(this.getVirtualHost().getServerPort(), serverPort)) {
                result = 1;
            }
        }

        // Log the result of the matching
        /*if (getLogger().isLoggable(Level.FINER)) {
            getLogger().finer(
                    "Call score for the \"" + getVirtualHost().getName()
                            + "\" host: " + result);
        }*/

        return result;
    },

    setNext: function(next) {
        this.callSuper("setNext", next);
    }
});