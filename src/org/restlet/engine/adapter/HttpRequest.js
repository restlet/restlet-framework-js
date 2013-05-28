HttpRequest = new [class Class]([class Request], {
    initialize: function(context, httpCall) {
        this.context = context;
        this.clientAdded = false;
        this.conditionAdded = false;
        this.cookiesAdded = false;
        this.entityAdded = false;
        this.referrerAdded = false;
        this.securityAdded = false;
        this.proxySecurityAdded = false;
        this.recipientsInfoAdded = false;
        this.warningsAdded = false;
        this.httpCall = httpCall;

        // Set the properties
        this.setMethod([class Method].valueOf(httpCall.getMethod()));

        // Set the host reference
        var sb = new [class StringBuilder]();
        sb.append(httpCall.getProtocol().getSchemeName()).append("://");
        sb.append(httpCall.getHostDomain());
        if ((httpCall.getHostPort() != -1)
                && (httpCall.getHostPort() != httpCall.getProtocol()
                        .getDefaultPort())) {
            sb.append(':').append(httpCall.getHostPort());
        }
        this.setHostRef(sb.toString());

        // Set the resource reference
        if (httpCall.getRequestUri() != null) {
            this.setResourceRef(new [class Reference](this.getHostRef(), httpCall.getRequestUri()));

            if (this.getResourceRef().isRelative()) {
                // Take care of the "/" between the host part and the segments.
                if (!httpCall.getRequestUri().startsWith("/")) {
                    this.setResourceRef(new [class Reference](this.getHostRef().toString() + "/"
                            + httpCall.getRequestUri()));
                } else {
                	this.setResourceRef(new [class Reference](this.getHostRef().toString()
                            + httpCall.getRequestUri()));
                }
            }

            this.setOriginalRef(this.getResourceRef().getTargetRef());
        }

        // Set the request date
        var dateHeader = httpCall.getRequestHeaders().getFirstValue(
                [class HeaderConstants].HEADER_DATE);
        var date = null;
        if (dateHeader != null) {
            date = [class DateUtils].parse(dateHeader);
        }

        if (date == null) {
            date = new Date();
        }

        this.setDate(date);
    },

    abort: function() {
        return this.getHttpCall().abort();
    },

    getCacheDirectives: function() {
        var result = this.callSuper("getCacheDirectives");
        if (!this.cacheDirectivesAdded) {
        	var headerList = this.getHttpCall().getRequestHeaders().subList(
                    			HeaderConstants.HEADER_CACHE_CONTROL);
            for (var i=0; i<headerList.length; i++) {
            	var header = headerList[i];
                [class CacheDirectiveReader].addValues(header, result);
            }

            this.cacheDirectivesAdded = true;
        }

        return result;
    },

    /*public ChallengeResponse getChallengeResponse() {
        var result = super.getChallengeResponse();

        if (!this.securityAdded) {
            // Extract the header value
            var authorization = this.getHttpCall().getRequestHeaders().getValues(
                    [class HeaderConstants].HEADER_AUTHORIZATION);

            // Set the challenge response
            result = [class AuthenticatorUtils].parseResponse(this, authorization,
                    this.getHttpCall().getRequestHeaders());
            this.setChallengeResponse(result);
            this.securityAdded = true;
        }

        return result;
    },*/

    getClientInfo: function() {
    	var result = this.callSuper("getClientInfo");

        if (!this.clientAdded) {
            // Extract the header values
            var acceptMediaType = this.getHttpCall().getRequestHeaders()
                    .getValues([class HeaderConstants].HEADER_ACCEPT);
            var acceptCharset = this.getHttpCall().getRequestHeaders().getValues(
            		[class HeaderConstants].HEADER_ACCEPT_CHARSET);
            var acceptEncoding = this.getHttpCall().getRequestHeaders()
                    .getValues([class HeaderConstants].HEADER_ACCEPT_ENCODING);
            var acceptLanguage = this.getHttpCall().getRequestHeaders()
                    .getValues([class HeaderConstants].HEADER_ACCEPT_LANGUAGE);
            var expect = this.getHttpCall().getRequestHeaders().getValues(
            		[class HeaderConstants].HEADER_EXPECT);

            // Parse the headers and update the call preferences

            // Parse the Accept* headers. If an error occurs during the parsing
            // of each header, the error is traced and we keep on with the other
            // headers.
            try {
            	[class PreferenceReader].addCharacterSets(acceptCharset, result);
            } catch (err) {
            	console.log(err.stack);
                //this.context.getLogger().log([class Level].INFO, err.message);
            }

            try {
            	[class PreferenceReader].addEncodings(acceptEncoding, result);
            } catch (err) {
            	console.log(err.stack);
                //this.context.getLogger().log([class Level].INFO, err.message);
            }

            try {
            	[class PreferenceReader].addLanguages(acceptLanguage, result);
            } catch (err) {
            	console.log(err.stack);
                //this.context.getLogger().log([class Level].INFO, err.message);
            }

            try {
            	[class PreferenceReader].addMediaTypes(acceptMediaType, result);
            } catch (err) {
            	console.log(err.stack);
                //this.context.getLogger().log([class Level].INFO, err.message);
            }

            try {
            	[class ExpectationReader].addValues(expect, result);
            } catch (err) {
            	console.log(err.stack);
                //this.context.getLogger().log([class Level].INFO, err.message);
            }

            // Set other properties
            result.setAgent(this.getHttpCall().getRequestHeaders().getValues(
            		[class HeaderConstants].HEADER_USER_AGENT));
            result.setFrom(this.getHttpCall().getRequestHeaders().getFirstValue(
            		[class HeaderConstants].HEADER_FROM));
            result.setAddress(this.getHttpCall().getClientAddress());
            result.setPort(this.getHttpCall().getClientPort());

            /*if (this.getHttpCall().getUserPrincipal() != null) {
                result.getPrincipals().add(this.getHttpCall().getUserPrincipal());
            }*/

            if (this.context != null) {
                // Special handling for the non standard but common
                // "X-Forwarded-For" header.
                var useForwardedForHeader = this.context.getParameters()
                                .getFirstValue("useForwardedForHeader", "false").toBoolean();
                if (useForwardedForHeader) {
                    // Lookup the "X-Forwarded-For" header supported by popular
                    // proxies and caches.
                    var header = this.getHttpCall().getRequestHeaders()
                            .getValues([class HeaderConstants].HEADER_X_FORWARDED_FOR);
                    if (header != null) {
                        var addresses = header.split(",");
                        for (var i = 0; i < addresses.length; i++) {
                            var address = addresses[i].trim();
                            result.getForwardedAddresses().add(address);
                        }
                    }
                }
            }

            this.clientAdded = true;
        }

        return result;
    },

    getConditions: function() {
        var result = this.callSuper("getConditions");

        if (!this.conditionAdded) {
            // Extract the header values
            var ifMatchHeader = this.getHttpCall().getRequestHeaders().getValues(
                    [class HeaderConstants].HEADER_IF_MATCH);
            var ifNoneMatchHeader = this.getHttpCall().getRequestHeaders()
                    .getValues([class HeaderConstants].HEADER_IF_NONE_MATCH);
            var ifModifiedSince = null;
            var ifUnmodifiedSince = null;
            var ifRangeHeader = this.getHttpCall().getRequestHeaders()
                    .getFirstValue([class HeaderConstants].HEADER_IF_RANGE);

            var requestHeaders = this.getHttpCall().getRequestHeaders();
            for (var i=0; i<requestHeaders.length; i++) {
            	var header = requestHeaders[i];
                if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_IF_MODIFIED_SINCE)) {
                    ifModifiedSince = [class HeaderReader].readDate(header.getValue(), false);
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_IF_UNMODIFIED_SINCE)) {
                    ifUnmodifiedSince = [class HeaderReader].readDate(
                            header.getValue(), false);
                }
            }

            // Set the If-Modified-Since date
            if ((ifModifiedSince != null) && (ifModifiedSince.getTime() != -1)) {
                result.setModifiedSince(ifModifiedSince);
            }

            // Set the If-Unmodified-Since date
            if ((ifUnmodifiedSince != null)
                    && (ifUnmodifiedSince.getTime() != -1)) {
                result.setUnmodifiedSince(ifUnmodifiedSince);
            }

            // Set the If-Match tags
            var match = null;
            var current = null;
            if (ifMatchHeader != null) {
                try {
                    var hr = new [class HeaderReader](ifMatchHeader);
                    var value = hr.readRawValue();

                    while (value != null) {
                        current = [class Tag].parse(value);

                        // Is it the first tag?
                        if (match == null) {
                            match = [];
                            result.setMatch(match);
                        }

                        // Add the new tag
                        match.add(current);

                        // Read the next token
                        value = hr.readRawValue();
                    }
                } catch (err) {
                    this.context.getLogger().log(
                            [class Level].INFO,
                            "Unable to process the if-match header: "
                                    + ifMatchHeader);
                }
            }

            // Set the If-None-Match tags
            var noneMatch = null;
            if (ifNoneMatchHeader != null) {
                try {
                    var hr = new [class HeaderReader](
                            ifNoneMatchHeader);
                    var value = hr.readRawValue();

                    while (value != null) {
                        current = [class Tag].parse(value);

                        // Is it the first tag?
                        if (noneMatch == null) {
                            noneMatch = [];
                            result.setNoneMatch(noneMatch);
                        }

                        noneMatch.add(current);

                        // Read the next token
                        value = hr.readRawValue();
                    }
                } catch (err) {
                    this.context.getLogger().log(
                            [class Level].INFO,
                            "Unable to process the if-none-match header: "
                                    + ifNoneMatchHeader);
                }
            }

            if (ifRangeHeader != null && ifRangeHeader.length() > 0) {
                var tag = [class Tag].parse(ifRangeHeader);

                if (tag != null) {
                    result.setRangeTag(tag);
                } else {
                    var date = [class HeaderReader].readDate(ifRangeHeader, false);
                    result.setRangeDate(date);
                }
            }

            this.conditionAdded = true;
        }

        return result;
    },

    getCookies: function() {
        var result = this.callSuper("getCookies");

        if (!this.cookiesAdded) {
            var cookieValues = this.getHttpCall().getRequestHeaders().getValues(
                    [class HeaderConstants].HEADER_COOKIE);

            if (cookieValues != null) {
                new [class CookieReader](cookieValues).addValues(result);
            }

            this.cookiesAdded = true;
        }

        return result;
    },

    getEntity: function() {
        if (!this.entityAdded) {
            this.setEntity(this.getHttpCall().getRequestEntity());
            this.entityAdded = true;
        }

        return this.callSuper("getEntity");
    },

    getHeaders: function() {
        return this.getAttributes().get(
                [class HeaderConstants].ATTRIBUTE_HEADERS);
    },

    getHttpCall: function() {
        return this.httpCall;
    },

    /*public ChallengeResponse getProxyChallengeResponse() {
        ChallengeResponse result = super.getProxyChallengeResponse();

        if (!this.proxySecurityAdded) {
            // Extract the header value
            final String authorization = getHttpCall().getRequestHeaders()
                    .getValues(HeaderConstants.HEADER_PROXY_AUTHORIZATION);

            // Set the challenge response
            result = AuthenticatorUtils.parseResponse(this, authorization,
                    getHttpCall().getRequestHeaders());
            setProxyChallengeResponse(result);
            this.proxySecurityAdded = true;
        }

        return result;
    }*/

    getRanges: function() {
        var result = this.callSuper("getRanges");

        if (!this.rangesAdded) {
            // Extract the header value
            var ranges = this.getHttpCall().getRequestHeaders().getValues(
                    [class HeaderConstants].HEADER_RANGE);
            result.addAll([class RangeReader].read(ranges));

            this.rangesAdded = true;
        }

        return result;
    },

    getRecipientsInfo: function() {
        var result = this.callSuper("getRecipientsInfo");
        if (!recipientsInfoAdded) {
        	var requestViaHeader = this.getHttpCall().getRequestHeaders().getValuesArray([class HeaderConstants].HEADER_VIA);
            for (var i=0; i<requestViaHeader.length; i++) {
            	var header = requestViaHeader[i];
                new [class RecipientInfoReader](header).addValues(result);
            }
            this.recipientsInfoAdded = true;
        }
        return result;
    },

    getReferrerRef: function() {
        if (!this.referrerAdded) {
            var referrerValue = this.getHttpCall().getRequestHeaders()
                    .getValues([class HeaderConstants].HEADER_REFERRER);
            if (referrerValue != null) {
                this.setReferrerRef(new [class Reference](referrerValue));
            }

            this.referrerAdded = true;
        }

        return this.callSuper("getReferrerRef");
    },

    getWarnings: function() {
        var result = this.callSuper("getWarnings");
        if (!this.warningsAdded) {
        	var requestWarningHeader = this.getHttpCall().getRequestHeaders().getValuesArray([class HeaderConstants].HEADER_WARNING);
            for (var i=0; i<requestWarningHeader.length; i++) {
            	var header = requestWarningHeader[i];
                new [class WarningReader](header).addValues(result);
            }
            warningsAdded = true;
        }
        return result;
    },

    /*public void setChallengeResponse(ChallengeResponse response) {
        super.setChallengeResponse(response);
        this.securityAdded = true;
    },*/

    setEntity: function(entity) {
        this.callSuper("setEntity", entity);
        this.entityAdded = true;
    },

    /*public void setProxyChallengeResponse(ChallengeResponse response) {
        super.setProxyChallengeResponse(response);
        this.proxySecurityAdded = true;
    },*/

    setRecipientsInfo: function(recipientsInfo) {
    	this.recipientsInfo = recipientsInfo;
        this.recipientsInfoAdded = true;
    },

    setWarnings: function(warnings) {
		this.warnings = warnings;
        this.warningsAdded = true;
    }
});

HttpRequest.extend({
	addHeader: function(request, headerName, headerValue) {
		if (request instanceof [class HttpRequest]) {
			request.getHeaders().add(new [class Header](headerName, headerValue));
		}
	}
});
