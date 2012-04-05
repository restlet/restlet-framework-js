var HeaderUtils = new [class Class]({});

HeaderUtils.extend({
	addEntityHeaders: function(entity, headers) {
        if (entity == null || !entity.isAvailable()) {
        	HeaderUtils.addHeader([class HeaderConstants].HEADER_CONTENT_LENGTH, "0", headers);
        } else if (entity.getAvailableSize() != [class Representation].UNKNOWN_SIZE) {
        	HeaderUtils.addHeader([class HeaderConstants].HEADER_CONTENT_LENGTH,
                    entity.getAvailableSize().toString(), headers);
        }

        if (entity != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_ENCODING,
        			[class EncodingWriter].write(entity.getEncodings()), headers);
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_LANGUAGE,
        			[class LanguageWriter].write(entity.getLanguages()), headers);

            if (entity.getLocationRef() != null) {
            	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_LOCATION, entity
                        .getLocationRef().getTargetRef().toString(), headers);
            }

            if (entity.getRange() != null) {
            	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_RANGE,
            			[class RangeWriter].write(entity.getRange(), entity.getSize()),
                        headers);
            }

            if (entity.getMediaType() != null) {
                var contentType = entity.getMediaType().toString();
 
                // Specify the character set parameter if required
                if ((entity.getMediaType().getParameters()
                        .getFirstValue("charset") == null)
                        && (entity.getCharacterSet() != null)) {
                    contentType = contentType + "; charset="
                            + entity.getCharacterSet().getName();
                }

                [class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_TYPE, contentType,
                        headers);
            }

            if (entity.getExpirationDate() != null) {
            	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_EXPIRES,
            			[class DateWriter].write(entity.getExpirationDate()), headers);
            }

            if (entity.getModificationDate() != null) {
            	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_LAST_MODIFIED,
            			[class DateWriter].write(entity.getModificationDate()), headers);
            }

            if (entity.getTag() != null) {
            	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ETAG,
            			[class TagWriter].write(entity.getTag()), headers);
            }

            if (entity.getDisposition() != null
                    && !Disposition.TYPE_NONE.equals(entity.getDisposition()
                            .getType())) {
            	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_DISPOSITION,
            			[class DispositionWriter].writeObject(entity.getDisposition()),
                        headers);
            }
        }
	},
	addExtensionHeaders: function(existingHeaders, additionalHeaders) {
        if (additionalHeaders != null) {
        	var elements = additionalHeaders.getElements();
            for (var cpt=0;cpt<elements.length;cpt++) {
            	var param = elements[cpt];
                if (param.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_ACCEPT)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_ACCEPT_CHARSET)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_ACCEPT_ENCODING)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_ACCEPT_LANGUAGE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_ACCEPT_RANGES)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_AGE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_ALLOW)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_AUTHENTICATION_INFO)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_AUTHORIZATION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CACHE_CONTROL)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONNECTION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_DISPOSITION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_ENCODING)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_LANGUAGE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_LENGTH)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_LOCATION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_MD5)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_RANGE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_CONTENT_TYPE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_COOKIE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_DATE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_ETAG)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_EXPECT)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_EXPIRES)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_FROM)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_HOST)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_IF_MATCH)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_IF_MODIFIED_SINCE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_IF_NONE_MATCH)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_IF_RANGE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_IF_UNMODIFIED_SINCE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_LAST_MODIFIED)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_LOCATION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_MAX_FORWARDS)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_PROXY_AUTHENTICATE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_PROXY_AUTHORIZATION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_RANGE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_REFERRER)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_RETRY_AFTER)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_SERVER)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_SET_COOKIE)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_SET_COOKIE2)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_USER_AGENT)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_VARY)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_VIA)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_WARNING)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_WWW_AUTHENTICATE)) {
                    // Standard headers that can't be overridden
                    /*Context.getCurrentLogger()
                            .warning(
                                    "Addition of the standard header \""
                                            + param.getName()
                                            + "\" is not allowed. Please use the equivalent property in the Restlet API.");*/
                } else if (param.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_PRAGMA)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_TRAILER)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_TRANSFER_ENCODING)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_TRANSFER_EXTENSION)
                        || param.getName().equalsIgnoreCase(
                                [class HeaderConstants].HEADER_UPGRADE)) {
                    // Standard headers that shouldn't be overridden
                    /*Context.getCurrentLogger()
                            .info("Addition of the standard header \""
                                    + param.getName()
                                    + "\" is discouraged as a future version of the Restlet API will directly support it.");*/
                    existingHeaders.push(param);
                } else {
                    existingHeaders.push(param);
                }
            }
        }
	},
	addGeneralHeaders: function(message, headers) {
		[class HeaderUtils].addHeader([class HeaderConstants].HEADER_CACHE_CONTROL,
				[class CacheDirectiveWriter].write(message.getCacheDirectives()),
                headers);
        if (message.getDate() == null) {
            message.setDate(new Date());
        }
        [class HeaderUtils].addHeader([class HeaderConstants].HEADER_DATE,
        		[class DateWriter].write(message.getDate()), headers);
        [class HeaderUtils].addHeader([class HeaderConstants].HEADER_VIA,
        		[class RecipientInfoWriter].write(message.getRecipientsInfo()), headers);
        [class HeaderUtils].addHeader([class HeaderConstants].HEADER_WARNING,
        		[class WarningWriter].write(message.getWarnings()), headers);
	},
	addHeader: function(headerName, headerValue, headers) {
        if ((headerName != null) && (headerValue != null)
                && (headerValue.length > 0)) {
            try {
                headers.push(new [class Parameter](headerName, headerValue));
            } catch (err) {
                /*Context.getCurrentLogger().log(Level.WARNING,
                        "Unable to format the " + headerName + " header", t);*/
            }
        }
	},
	addNotModifiedEntityHeaders: function(entity, headers) {
        if (entity != null) {
            if (entity.getTag() != null) {
                [class HeaderUtils].addHeader([class HeaderConstants].HEADER_ETAG,
                		[class TagWriter].write(entity.getTag()), headers);
            }

            if (entity.getLocationRef() != null) {
                [class HeaderUtils].addHeader([class HeaderConstants].HEADER_CONTENT_LOCATION,
                        entity.getLocationRef().getTargetRef().toString(),
                        headers);
            }
        }
	},
	addRequestHeaders: function(request, headers) {
        var clientInfo = request.getClientInfo();

        if (!clientInfo.getAcceptedMediaTypes().isEmpty()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ACCEPT,
        			[class PreferenceWriter].write(clientInfo.getAcceptedMediaTypes()),
                    headers);
        } else {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ACCEPT, MediaType.ALL.getName(),
                    headers);
        }

        if (!clientInfo.getAcceptedCharacterSets().isEmpty()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ACCEPT_CHARSET,
        			[class PreferenceWriter].write(clientInfo
                            .getAcceptedCharacterSets()), headers);
        }

        if (!clientInfo.getAcceptedEncodings().isEmpty()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ACCEPT_ENCODING,
        			[class PreferenceWriter].write(clientInfo.getAcceptedEncodings()),
                    headers);
        }

        if (!clientInfo.getAcceptedLanguages().isEmpty()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ACCEPT_LANGUAGE,
        			[class PreferenceWriter].write(clientInfo.getAcceptedLanguages()),
                    headers);
        }

        if (clientInfo.getFrom() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_FROM, request.getClientInfo()
                    .getFrom(), headers);
        }

        // Manually add the host name and port when it is potentially
        // different from the one specified in the target resource reference.
        var hostRef = (request.getResourceRef().getBaseRef() != null) ? request
                .getResourceRef().getBaseRef() : request.getResourceRef();

        if (hostRef.getHostDomain() != null) {
            var host = hostRef.getHostDomain();
            var hostRefPortValue = hostRef.getHostPort();

            if ((hostRefPortValue != -1)
                    && (hostRefPortValue != request.getProtocol()
                            .getDefaultPort())) {
                host = host + ':' + hostRefPortValue;
            }

            [class HeaderUtils].addHeader([class HeaderConstants].HEADER_HOST, host, headers);
        }

        var conditions = request.getConditions();
        [class HeaderUtils].addHeader([class HeaderConstants].HEADER_IF_MATCH,
        		[class TagWriter].write(conditions.getMatch()), headers);
        [class HeaderUtils].addHeader([class HeaderConstants].HEADER_IF_NONE_MATCH,
        		[class TagWriter].write(conditions.getNoneMatch()), headers);

        if (conditions.getModifiedSince() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_IF_MODIFIED_SINCE,
        			[class DateWriter].write(conditions.getModifiedSince()), headers);
        }

        if (conditions.getRangeTag() != null
                && conditions.getRangeDate() != null) {
            //Context.getCurrentLogger()
            //        .log(Level.WARNING,
            //                "Unable to format the HTTP If-Range header due to the presence of both entity tag and modification date.");
        } else if (conditions.getRangeTag() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_IF_RANGE,
        			[class TagWriter].write(conditions.getRangeTag()), headers);
        } else if (conditions.getRangeDate() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_IF_RANGE,
        			[class DateWriter].write(conditions.getRangeDate()), headers);
        }

        if (conditions.getUnmodifiedSince() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_IF_UNMODIFIED_SINCE,
        			[class DateWriter].write(conditions.getUnmodifiedSince()), headers);
        }

        if (request.getMaxForwards() > -1) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_MAX_FORWARDS,
                    request.getMaxForwards().toString(), headers);
        }

        if (!request.getRanges().isEmpty()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_RANGE,
        			[class RangeWriter].write(request.getRanges()), headers);
        }

        if (request.getReferrerRef() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_REFERRER, request.getReferrerRef()
                    .toString(), headers);
        }

        if (request.getClientInfo().getAgent() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_USER_AGENT, request
                    .getClientInfo().getAgent(), headers);
        } else {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_USER_AGENT, Engine.VERSION_HEADER,
                    headers);
        }

        // ----------------------------------
        // 3) Add supported extension headers
        // ----------------------------------

        if (request.getCookies().size() > 0) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_COOKIE,
        			[class CookieWriter].writeCollection(request.getCookies()), headers);
        }

        // -------------------------------------
        // 4) Add user-defined extension headers
        // -------------------------------------
        var additionalHeaders = request
                .getAttributes()[[class HeaderConstants].ATTRIBUTE_HEADERS];
        [class HeaderUtils].addExtensionHeaders(headers, additionalHeaders);

        // ---------------------------------------
        // 5) Add authorization headers at the end
        // ---------------------------------------

        // Add the security headers. NOTE: This must stay at the end because
        // the AWS challenge scheme requires access to all HTTP headers
        /*ChallengeResponse challengeResponse = request.getChallengeResponse();
        if (challengeResponse != null) {
            this.addHeader(
                    [class HeaderConstants].HEADER_AUTHORIZATION,
                    [class AuthenticatorUtils]
                            .formatResponse(challengeResponse, request, headers),
                    headers);
        }

        ChallengeResponse proxyChallengeResponse = request
                .getProxyChallengeResponse();
        if (proxyChallengeResponse != null) {
            addHeader([class HeaderConstants].HEADER_PROXY_AUTHORIZATION,
                    [class AuthenticatorUtils]
                            .formatResponse(proxyChallengeResponse, request,
                                    headers), headers);
        }*/
	},
	addResponseHeaders: function(response, headers) {
        if (response.getServerInfo().isAcceptingRanges()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ACCEPT_RANGES, "bytes", headers);
        }

        if (response.getAge() > 0) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_AGE,
                    	response.getAge().toString(), headers);
        }

        if (response.getStatus().equals(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED)
                || Method.OPTIONS.equals(response.getRequest().getMethod())) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_ALLOW,
        			[class MethodWriter].write(response.getAllowedMethods()), headers);
        }

        if (response.getLocationRef() != null) {
            // The location header must contain an absolute URI.
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_LOCATION, response
                    .getLocationRef().getTargetRef().toString(), headers);
        }

        //TODO:
        /*if (response.getProxyChallengeRequests() != null) {
            for (ChallengeRequest challengeRequest : response
                    .getProxyChallengeRequests()) {
                addHeader([class HeaderConstants].HEADER_PROXY_AUTHENTICATE,
                        org.restlet.engine.security.AuthenticatorUtils
                                .formatRequest(challengeRequest, response,
                                        headers), headers);
            }
        }*/

        if (response.getRetryAfter() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_RETRY_AFTER,
        			[class DateWriter].write(response.getRetryAfter()), headers);
        }

        if ((response.getServerInfo() != null)
                && (response.getServerInfo().getAgent() != null)) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_SERVER, response.getServerInfo()
                    .getAgent(), headers);
        } else {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_SERVER, Engine.VERSION_HEADER,
                    headers);
        }

        // Send the Vary header only to none-MSIE user agents as MSIE seems
        // to support partially and badly this header (cf issue 261).
        if (!((response.getRequest().getClientInfo().getAgent() != null) && response
                .getRequest().getClientInfo().getAgent().contains("MSIE"))) {
            // Add the Vary header if content negotiation was used
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_VARY,
        			[class DimensionWriter].write(response.getDimensions()), headers);
        }

        // Set the security data
        //TODO:
        /*if (response.getChallengeRequests() != null) {
            for (ChallengeRequest challengeRequest : response
                    .getChallengeRequests()) {
                addHeader([class HeaderConstants].HEADER_WWW_AUTHENTICATE,
                        org.restlet.engine.security.AuthenticatorUtils
                                .formatRequest(challengeRequest, response,
                                        headers), headers);
            }
        }*/

        // ----------------------------------
        // 3) Add supported extension headers
        // ----------------------------------

        // Add the Authentication-Info header
        /*if (response.getAuthenticationInfo() != null) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_AUTHENTICATION_INFO,
                    org.restlet.engine.security.AuthenticatorUtils
                            .formatAuthenticationInfo(response
                                    .getAuthenticationInfo()), headers);
        }*/

        // Cookies settings should be written in a single header, but Web
        // browsers does not seem to support it.
        //TODO:
        /*for (CookieSetting cookieSetting : response.getCookieSettings()) {
        	[class HeaderUtils].addHeader([class HeaderConstants].HEADER_SET_COOKIE,
                    CookieSettingWriter.write(cookieSetting), headers);
        }*/

        // -------------------------------------
        // 4) Add user-defined extension headers
        // -------------------------------------

        var additionalHeaders = response
                .getAttributes()[[class HeaderConstants].ATTRIBUTE_HEADERS];
        [class HeaderUtils].addExtensionHeaders(headers, additionalHeaders);
	},
	extractEntityHeaders: function(headers, representation) {
	    var result = (representation == null) ? new EmptyRepresentation()
	            : representation;
	    var entityHeaderFound = false;
	
	    if (headers != null) {
	        for (var cpt = 0; cpt<headers.length; cpt++) {
	        	var header = headers[cpt];
	            if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_TYPE)) {
	                var contentType = new [class ContentType](header.getValue());
	                result.setMediaType(contentType.getMediaType());
	
	                if ((result.getCharacterSet() == null)
	                        || (contentType.getCharacterSet() != null)) {
	                    result.setCharacterSet(contentType.getCharacterSet());
	                }
	
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_LENGTH)) {
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_EXPIRES)) {
	                result.setExpirationDate([class HeaderReader].readDate(
	                        header.getValue(), false));
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_ENCODING)) {
	                new [class EncodingReader](header.getValue()).addValues(result
	                        .getEncodings());
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_LANGUAGE)) {
	                new [class LanguageReader](header.getValue()).addValues(result
	                        .getLanguages());
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_LAST_MODIFIED)) {
	                result.setModificationDate([class HeaderReader].readDate(
	                        header.getValue(), false));
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_ETAG)) {
	                result.setTag([class Tag].parse(header.getValue()));
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_LOCATION)) {
	                result.setLocationRef(header.getValue());
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_DISPOSITION)) {
	                /*try {
	                    result.setDisposition(new DispositionReader(header
	                            .getValue()).readValue());
	                    entityHeaderFound = true;
	                } catch (IOException ioe) {
	                    Context.getCurrentLogger().log(
	                            Level.WARNING,
	                            "Error during Content-Disposition header parsing. Header: "
	                                    + header.getValue(), ioe);
	                }*/
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_RANGE)) {
	                /*org.restlet.engine.header.RangeReader.update(
	                        header.getValue(), result);*/
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    [class HeaderConstants].HEADER_CONTENT_MD5)) {
	                /*result.setDigest(new org.restlet.data.Digest(
	                        org.restlet.data.Digest.ALGORITHM_MD5,
	                        org.restlet.engine.util.Base64.decode(header
	                                .getValue())));*/
	                entityHeaderFound = true;
	            }
	        }
	    }
	
	    // If no representation was initially expected and no entity header
	    // is found, then do not return any representation
	    if ((representation == null) && !entityHeaderFound) {
	        result = null;
	    }
	
	    return result;
	},
	copyResponseTransportHeaders: function(headers, response) {
		if (headers != null) {
            for (var cpt=0; cpt<headers.length; cpt++) {
            	var header = headers[cpt]; 
                if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_LOCATION)) {
                    response.setLocationRef(header.getValue());
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_AGE)) {
                    try {
                        response.setAge(parseInt(header.getValue()));
                    } catch (err) {
                        /*Context.getCurrentLogger().log(
                                Level.WARNING,
                                "Error during Age header parsing. Header: "
                                        + header.getValue(), nfe);*/
                    }
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_DATE)) {
                    var date = [class DateUtils].parse(header.getValue());

                    if (date == null) {
                        date = new Date();
                    }

                    response.setDate(date);
                /*} else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_RETRY_AFTER)) {
                    // [ifndef gwt]
                    Date retryAfter = DateUtils.parse(header.getValue());

                    if (retryAfter == null) {
                        // The date might be expressed as a number of seconds
                        try {
                            int retryAfterSecs = Integer.parseInt(header
                                    .getValue());
                            java.util.Calendar calendar = java.util.Calendar
                                    .getInstance();
                            calendar.add(java.util.Calendar.SECOND,
                                    retryAfterSecs);
                            retryAfter = calendar.getTime();
                        } catch (NumberFormatException nfe) {
                            Context.getCurrentLogger().log(
                                    Level.WARNING,
                                    "Error during Retry-After header parsing. Header: "
                                            + header.getValue(), nfe);
                        }
                    }

                    response.setRetryAfter(retryAfter);
                    // [enddef]
                } else if ((header.getName()
                        .equalsIgnoreCase([class HeaderConstants].HEADER_SET_COOKIE))
                        || (header.getName()
                                .equalsIgnoreCase([class HeaderConstants].HEADER_SET_COOKIE2))) {
                    try {
                        CookieSettingReader cr = new CookieSettingReader(
                                header.getValue());
                        response.getCookieSettings().add(cr.readValue());
                    } catch (Exception e) {
                        Context.getCurrentLogger().log(
                                Level.WARNING,
                                "Error during cookie setting parsing. Header: "
                                        + header.getValue(), e);
                    }
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_WWW_AUTHENTICATE)) {
                    // [ifndef gwt]
                    List<ChallengeRequest> crs = org.restlet.engine.security.AuthenticatorUtils
                            .parseRequest(response, header.getValue(), headers);
                    response.getChallengeRequests().addAll(crs);
                    // [enddef]
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_PROXY_AUTHENTICATE)) {
                    // [ifndef gwt]
                    List<ChallengeRequest> crs = org.restlet.engine.security.AuthenticatorUtils
                            .parseRequest(response, header.getValue(), headers);
                    response.getProxyChallengeRequests().addAll(crs);
                    // [enddef]
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_AUTHENTICATION_INFO)) {
                    // [ifndef gwt]
                    AuthenticationInfo authenticationInfo = org.restlet.engine.security.AuthenticatorUtils
                            .parseAuthenticationInfo(header.getValue());
                    response.setAuthenticationInfo(authenticationInfo);
                    // [enddef]*/
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_SERVER)) {
                    response.getServerInfo().setAgent(header.getValue());
                /*} else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_ALLOW)) {
                    MethodReader
                            .addValues(header, response.getAllowedMethods());*/
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_VARY)) {
                    [class DimensionReader].addValues(header, response.getDimensions());
                /*} else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_VIA)) {
                    RecipientInfoReader.addValues(header,
                            response.getRecipientsInfo());
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_WARNING)) {
                    WarningReader.addValues(header, response.getWarnings());
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_CACHE_CONTROL)) {
                    CacheDirectiveReader.addValues(header,
                            response.getCacheDirectives());
                } else if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_ACCEPT_RANGES)) {
                    TokenReader tr = new TokenReader(header.getValue());
                    response.getServerInfo().setAcceptingRanges(
                            tr.readValues().contains("bytes"));*/
                }
            }
        }
	},
	getContentLength: function(headers) {
        var contentLength = [class Representation].UNKNOWN_SIZE;

        if (headers != null) {
            // Extract the content length header
            for (var cpt=0; cpt<headers.length; cpt++) {
            	var header = headers[cpt]
                if (header.getName().equalsIgnoreCase(
                        [class HeaderConstants].HEADER_CONTENT_LENGTH)) {
                    try {
                        contentLength = parseFloat(header.getValue());
                    } catch (err) {
                        contentLength = [class Representation].UNKNOWN_SIZE;
                    }
                }
            }
        }

        return contentLength;
	},
	getCharacterCode: function(character) {
    	return character.charCodeAt(0);
	},
    isAlpha: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return [class HeaderUtils].isUpperCase(character)
        			|| [class HeaderUtils].isLowerCase(character);
    },
    isAsciiChar: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return (code >= 0) && (code <= 127);
    },
    isCarriageReturn: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return (code == 13);
    },
    isChunkedEncoding: function(headers) {
        var result = false;

        if (headers != null) {
            var header = headers.getFirstValue(
                    [class HeaderConstants].HEADER_TRANSFER_ENCODING, true);
            result = "chunked".equalsIgnoreCase(header);
        }

        return result;
    },
    isComma: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == ',');
    },
    isCommentText: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return [class HeaderUtils].isText(character) && (character != '(') && (character != ')');
    },
    isConnectionClose: function(headers) {
        var result = false;

        if (headers != null) {
            var header = headers.getFirstValue(
                    [class HeaderConstants].HEADER_CONNECTION, true);
            result = "close".equalsIgnoreCase(header);
        }

        return result;
    },
    isControlChar: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return ((code >= 0) && (code <= 31)) || (code == 127);
    },
    isDigit: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character >= '0') && (character <= '9');
    },
    isDoubleQuote: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return (code == 34);
    },
    isHorizontalTab: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == 9);
    },
    isLatin1Char: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return (code >= 0) && (code <= 255);
    },
    isLinearWhiteSpace: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return ([class HeaderUtils].isCarriageReturn(character)
        		|| [class HeaderUtils].isSpace(character)
                || [class HeaderUtils].isLineFeed(character)
                || [class HeaderUtils].isHorizontalTab(character));
    },
    isLineFeed: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return (code == 10);
    },
    isLowerCase: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character >= 'a') && (character <= 'z');
    },
    isQuoteCharacter: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == '\\');
    },
    isQuotedText: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return [class HeaderUtils].isText(character) && ![class HeaderUtils].isDoubleQuote(character);
    },
    isSemiColon: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == ';');
    },
    isSeparator: function(character) {
    	if (character==-1) {
    		return false;
    	}
        switch (character) {
        case '(':
        case ')':
        case '<':
        case '>':
        case '@':
        case ',':
        case ';':
        case ':':
        case '\\':
        case '"':
        case '/':
        case '[':
        case ']':
        case '?':
        case '=':
        case '{':
        case '}':
        case ' ':
        case '\t':
            return true;

        default:
            return false;
        }
    },
    isSpace: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = [class HeaderUtils].getCharacterCode(character);
        return (code == 32);
    },
    isText: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return [class HeaderUtils].isLatin1Char(character)
        		&& ![class HeaderUtils].isControlChar(character);
    },
    isToken: function(token) {
    	if (character==-1) {
    		return false;
    	}
        for (var i = 0; i < token.length; i++) {
            if (![class HeaderUtils].isTokenChar(token.charAt(i))) {
                return false;
            }
        }

        return true;
    },
    isTokenChar: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return [class HeaderUtils].isAsciiChar(character)
        		&& ![class HeaderUtils].isSeparator(character);
    },
    isUpperCase: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character >= 'A') && (character <= 'Z');
    }
});