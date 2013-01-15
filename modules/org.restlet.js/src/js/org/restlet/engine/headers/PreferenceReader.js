var PreferenceReader = new [class Class](HeaderReader, {
    initialize: function(type, header) {
        this.callSuperCstr(header);
        this.type = type;
    },

    createPreference: function(metadata, parameters) {
        var result;

        if (parameters == null) {
            result = new [class Preference]();

            switch (this.type) {
            case PreferenceReader.TYPE_CHARACTER_SET:
                result.setMetadata([class CharacterSet].valueOf(metadata.toString()));
                break;

            case PreferenceReader.TYPE_ENCODING:
                result.setMetadata([class Encoding].valueOf(metadata.toString()));
                break;

            case PreferenceReader.TYPE_LANGUAGE:
                result.setMetadata([class Language].valueOf(metadata.toString()));
                break;

            case PreferenceReader.TYPE_MEDIA_TYPE:
                result.setMetadata([class MediaType].valueOf(metadata.toString()));
                break;
            }
        } else {
            var mediaParams = this.extractMediaParams(parameters);
            var quality = this.extractQuality(parameters);
            result = new [class Preference](null, quality, parameters);

            switch (this.type) {
            case PreferenceReader.TYPE_CHARACTER_SET:
                result.setMetadata(new [class CharacterSet](metadata.toString()));
                break;

            case PreferenceReader.TYPE_ENCODING:
                result.setMetadata(new [class Encoding](metadata.toString()));
                break;

            case PreferenceReader.TYPE_LANGUAGE:
                result.setMetadata(new [class Language](metadata.toString()));
                break;

            case PreferenceReader.TYPE_MEDIA_TYPE:
                result.setMetadata(new [class MediaType](metadata.toString(),
                        mediaParams));
                break;
            }
        }

        return result;
    },

    extractMediaParams: function(parameters) {
        var result = null;
        var qualityFound = false;
        var param = null;

        if (parameters != null) {
            result = new [class Series]();
            
            var elements = parameters.getElements();
            for (var i=0; !qualityFound && i<elements.length; i++) {
                param = elements[i];

                if (param.getName().equals("q")) {
                    qualityFound = true;
                } else {
                    elements.remove(i);
                    result.add(param);
                }
            }
        }

        return result;
    },

    extractQuality: function(parameters) {
        var result = 1;
        var found = false;

        if (parameters != null) {
            var param = null;

            var elements = parameters.getElements();
            for (var i=0; !found && i<elements.length; i++) {
                param = elements[i];
                if (param.getName().equals("q")) {
                    result = PreferenceReader.readQuality(param.getValue());
                    found = true;

                    //TODO
                    // Remove the quality parameter as we will directly store it
                    // in the Preference object
                    elements.remove(i);
                }
            }
        }

        return result;
    },

    readValue: function() {
        var result = null;

        var readingMetadata = true;
        var readingParamName = false;
        var readingParamValue = false;

        var metadataBuffer = new [class StringBuilder]();
        var paramNameBuffer = null;
        var paramValueBuffer = null;

        var parameters = null;
        var next = 0;

        while (result == null) {
            next = this.read();

            if (readingMetadata) {
                if ((next == -1) ||  [class HeaderUtils].isComma(next)) {
                    if (metadataBuffer.length() > 0) {
                        // End of metadata section
                        // No parameters detected
                        result = this.createPreference(metadataBuffer, null);
                    } else {
                        // Ignore empty metadata name
                        break;
                    }
                } else if (next == ';') {
                    if (metadataBuffer.length() > 0) {
                        // End of metadata section
                        // Parameters detected
                        readingMetadata = false;
                        readingParamName = true;
                        paramNameBuffer = new [class StringBuilder]();
                        parameters = new [class Series]();
                    } else {
                        throw new Error("Empty metadata name detected.");
                    }
                } else if ([class HeaderUtils].isSpace(next)) {
                    // Ignore spaces
                } else if ([class HeaderUtils].isText(next)) {
                    metadataBuffer.append(next);
                } else {
                    throw new Error("Unexpected character \""
                            + next + "\" detected.");
                }
            } else if (readingParamName) {
                if (next == '=') {
                    if (paramNameBuffer.length() > 0) {
                        // End of parameter name section
                        readingParamName = false;
                        readingParamValue = true;
                        paramValueBuffer = new [class StringBuilder]();
                    } else {
                        throw new Error("Empty parameter name detected.");
                    }
                } else if ((next == -1) || [class HeaderUtils].isComma(next)) {
                    if (paramNameBuffer.length() > 0) {
                        // End of parameters section
                        parameters.add([class Parameter].create(paramNameBuffer, null));
                        result = this.createPreference(metadataBuffer, parameters);
                    } else {
                        throw new Error("Empty parameter name detected.");
                    }
                } else if (next == ';') {
                    // End of parameter
                    parameters.add([class Parameter].create(paramNameBuffer, null));
                    paramNameBuffer = new [class StringBuilder]();
                    readingParamName = true;
                    readingParamValue = false;
                } else if ([class HeaderUtils].isSpace(next) && (paramNameBuffer.length() == 0)) {
                    // Ignore white spaces
                } else if ([class HeaderUtils].isTokenChar(next)) {
                    paramNameBuffer.append(next);
                } else {
                    throw new Error("Unexpected character \""
                            + next + "\" detected.");
                }
            } else if (readingParamValue) {
                if ((next == -1) || [class HeaderUtils].isComma(next) || [class HeaderUtils].isSpace(next)) {
                    if (paramValueBuffer.length() > 0) {
                        // End of parameters section
                        parameters.add([class Parameter].create(paramNameBuffer,
                                paramValueBuffer));
                        result = this.createPreference(metadataBuffer, parameters);
                    } else {
                        throw new Error("Empty parameter value detected");
                    }
                } else if (next == ';') {
                    // End of parameter
                    parameters.add([class Parameter].create(paramNameBuffer,
                            paramValueBuffer));
                    paramNameBuffer = new [class StringBuilder]();
                    readingParamName = true;
                    readingParamValue = false;
                } else if ((next == '"') && (paramValueBuffer.length() == 0)) {
                    // Parse the quoted string
                    var done = false;
                    var quotedPair = false;

                    while ((!done) && (next != -1)) {
                        next = this.read();

                        if (quotedPair) {
                            // End of quoted pair (escape sequence)
                            if ([class HeaderUtils].isText(next)) {
                                paramValueBuffer.append(next);
                                quotedPair = false;
                            } else {
                                throw new Error(
                                        "Invalid character detected in quoted string. Please check your value");
                            }
                        } else if ([class HeaderUtils].isDoubleQuote(next)) {
                            // End of quoted string
                            done = true;
                        } else if (next == '\\') {
                            // Begin of quoted pair (escape sequence)
                            quotedPair = true;
                        } else if ([class HeaderUtils].isText(next)) {
                            paramValueBuffer.append(next);
                        } else {
                            throw new Error(
                                    "Invalid character detected in quoted string. Please check your value");
                        }
                    }
                } else if ([class HeaderUtils].isTokenChar(next)) {
                    paramValueBuffer.append(next);
                } else {
                    throw new Error("Unexpected character \""
                            + next + "\" detected.");
                }
            }
        }

        if ([class HeaderUtils].isComma(next)) {
            // Unread character which isn't part of the value
        	this.unread();
        }

        return result;
    }
});

PreferenceReader.extend({
	TYPE_CHARACTER_SET: 1,
	TYPE_ENCODING: 2,
	TYPE_LANGUAGE: 3,
	TYPE_MEDIA_TYPE: 4,

	addCharacterSets: function(acceptCharsetHeader, clientInfo) {
		if (acceptCharsetHeader != null) {
			// Implementation according to
			// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.2
			if (acceptCharsetHeader.length() == 0) {
				clientInfo.getAcceptedCharacterSets().add(
						new [class Preference]([class CharacterSet].ISO_8859_1));
			} else {
				var pr = new [class PreferenceReader](
						[class PreferenceReader].TYPE_CHARACTER_SET,
						acceptCharsetHeader);
				pr.addValues(clientInfo.getAcceptedCharacterSets());
			}
		} else {
			clientInfo.getAcceptedCharacterSets().add(
					new [class Preference]([class CharacterSet].ALL));
		}
	},

	addEncodings: function(acceptEncodingHeader, clientInfo) {
	    if (acceptEncodingHeader != null) {
	        var pr = new [class PreferenceReader](
	                [class PreferenceReader].TYPE_ENCODING, acceptEncodingHeader);
	        pr.addValues(clientInfo.getAcceptedEncodings());
	    } else {
	        clientInfo.getAcceptedEncodings().add(
	                new [class Preference]([class Encoding].IDENTITY));
	    }
	},
	
	addLanguages: function(acceptLanguageHeader, clientInfo) {
	    if (acceptLanguageHeader != null) {
	        var pr = new PreferenceReader(
	                PreferenceReader.TYPE_LANGUAGE, acceptLanguageHeader);
	        pr.addValues(clientInfo.getAcceptedLanguages());
	    } else {
	        clientInfo.getAcceptedLanguages().add(new [class Preference]([class Language].ALL));
	    }
	},

	addMediaTypes: function(acceptMediaTypeHeader, clientInfo) {
	    if (acceptMediaTypeHeader != null) {
	        var pr = new [class PreferenceReader](
	                [class PreferenceReader].TYPE_MEDIA_TYPE, acceptMediaTypeHeader);
	        pr.addValues(clientInfo.getAcceptedMediaTypes());
	    } else {
	        clientInfo.getAcceptedMediaTypes().add(
	                new [class Preference]([class MediaType].ALL));
	    }
	},
	
	readQuality: function(quality) {
	    try {
	        var result = parseFloat(quality);
	
	        if ([class PreferenceWriter].isValidQuality(result)) {
	            return result;
	        }
	
	        throw new Error(
	                "Invalid quality value detected. Value must be between 0 and 1.");
	    } catch (err) {
	        throw new Error(
	                "Invalid quality value detected. Value must be between 0 and 1.");
	    }
	}
});