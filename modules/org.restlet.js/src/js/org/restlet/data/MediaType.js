var MediaType = new [class Class](Metadata, {
	initialize: function(name, parameters, description) {
		if (description==null) {
			description = "Media type or range of media types";
		}
        this.callSuperCstr(MediaType.normalizeType(name, parameters), description);
    },

    equals: function(obj, ignoreParameters) {
    	if (ignoreParameters==null) {
    		ignoreParameters = false;
    	}
        var result = (obj == this);

        // if obj == this no need to go further
        if (!result) {
            // if obj isn't a mediatype or is null don't evaluate further
            if (obj instanceof MediaType) {
                var that = obj;
                if (this.getMainType().equals(that.getMainType())
                        && this.getSubType().equals(that.getSubType())) {
                    result = ignoreParameters
                            || this.getParameters().equals(that.getParameters());
                }
            }
        }

        return result;
    },

    getMainType: function() {
        var result = null;

        if (this.getName() != null) {
            var index = this.getName().indexOf('/');

            // Some clients appear to use name types without subtypes
            if (index == -1) {
                index = this.getName().indexOf(';');
            }

            if (index == -1) {
                result = this.getName();
            } else {
                result = this.getName().substring(0, index);
            }
        }

        return result;
    },

	getParameters: function() {
        if (this.parameters == null) {
            if (this.getName() != null) {
                var index = this.getName().indexOf(';');

                if (index != -1) {
                	this.parameters = new Form(this.getName().substring(index + 1)
                            .trim(), ';');
                }
            }
            
            if (this.parameters==null) {
            	this.parameters = new Form();
            }
        }
        return this.parameters;
    },

    getParent: function() {
        var result = null;

        if (this.getParameters().size() > 0) {
            result = MediaType.valueOf(this.getMainType() + "/" + this.getSubType());
        } else {
            if (this.getSubType().equals("*")) {
                result = this.equals(MediaType.ALL) ? null : MediaType.ALL;
            } else {
                result = MediaType.valueOf(this.getMainType() + "/*");
            }
        }

        return result;
    },

    getSubType: function() {
        var result = null;

        if (this.getName() != null) {
            var slash = this.getName().indexOf('/');

            if (slash == -1) {
                // No subtype found, assume that all subtypes are accepted
                result = "*";
            } else {
                var separator = this.getName().indexOf(';');
                if (separator == -1) {
                    result = this.getName().substring(slash + 1);
                } else {
                    result = this.getName().substring(slash + 1, separator);
                }
            }
        }

        return result;
    },

    includes: function(included) {
        var result = this.equals(MediaType.ALL) || this.equals(included);

        if (!result && (included instanceof MediaType)) {
            var includedMediaType = included;

            if (this.getMainType().equals(includedMediaType.getMainType())) {
                // Both media types are different
                if (this.getSubType().equals(includedMediaType.getSubType())) {
                    result = true;
                } else if (this.getSubType().equals("*")) {
                    result = true;
                } else if (this.getSubType().startsWith("*+")
                        && includedMediaType.getSubType().endsWith(
                        		this.getSubType().substring(2))) {
                    result = true;
                }
            }
        }

        return result;
    },

    isConcrete: function() {
        return !this.getName().contains("*");
    }
});

MediaType.extend({
    _types: null,
    _TSPECIALS: "()<>@,;:/[]?=\\\"",
    register: function(name, description) {
        if (MediaType.getTypes()[name]==null) {
            var type = new MediaType(name, null, description);
            MediaType.getTypes()[name] = type;
        }

        return MediaType.getTypes()[name];
	},

	valueOf: function(name) {
        var result = null;

        if ((name != null) && !name.equals("")) {
            result = MediaType.getTypes()[name];
            if (result == null) {
                result = new [class MediaType](name);
            }
        }

        return result;
    },

    getTypes: function() {
        if (MediaType._types == null) {
        	MediaType._types = {};
        }
        return MediaType._types;
    },

    getMostSpecific: function(mediaTypes) {
    	if ((mediaTypes == null) || (mediaTypes.length == 0)) {
    		throw new Error("You must give at least one MediaType");
    	}

    	if (mediaTypes.length == 1) {
    		return mediaTypes[0];
    	}

    	var mostSpecific = mediaTypes[0];

    	for (var i = 1; i < mediaTypes.length; i++) {
    		var mediaType = mediaTypes[i];

    		if (mediaType != null) {
    			if (mediaType.getMainType().equals("*")) {
    				continue;
    			}

    			if (mostSpecific.getMainType().equals("*")) {
    				mostSpecific = mediaType;
    				continue;
    			}

    			if (mostSpecific.getSubType().contains("*")) {
    				mostSpecific = mediaType;
    				continue;
    			}
    		}
    	}

    	return mostSpecific;
    }
});

MediaType.normalizeToken = function(token) {
    var length;
    var c;

    // Makes sure we're not dealing with a "*" token.
    token = token.trim();
    if ("".equals(token) || "*".equals(token))
        return "*";

    // Makes sure the token is RFC compliant.
    length = token.length;
    for (var i = 0; i < length; i++) {
        c = token.charAt(i);
        if (c <= 32 || c >= 127 || MediaType._TSPECIALS.indexOf(c) != -1)
            throw new Error("Illegal token: " + token);
    }

    return token;
};

MediaType.normalizeType = function(name, parameters) {
    var slashIndex;
    var colonIndex;
    var mainType;
    var subType;
    var params = null;

    // Ignore null names (backward compatibility).
    if (name == null)
        return null;

    // Check presence of parameters
    if ((colonIndex = name.indexOf(';')) != -1) {
        params = new [class StringBuilder](name.substring(colonIndex));
        name = name.substring(0, colonIndex);
    }

    // No main / sub separator, assumes name/*.
    if ((slashIndex = name.indexOf('/')) == -1) {
        mainType = MediaType.normalizeToken(name);
        subType = "*";
    } else {
        // Normalizes the main and sub types.
        mainType = MediaType.normalizeToken(name.substring(0, slashIndex));
        subType = MediaType.normalizeToken(name.substring(slashIndex + 1));
    }

    // Merge parameters taken from the name and the method argument.
    if (parameters != null && !parameters.isEmpty()) {
        if (params == null) {
            params = new [class StringBuilder]();
        }
        var hw = new HeaderWriter();
        hw.appendObject = function(value) {
        	return this.appendExtension(value);
        };
        for (var i = 0; i < parameters.size(); i++) {
            var p = parameters.get(i);
            hw.appendParameterSeparator();
            hw.appendSpace();
            hw.appendObject(p);
        }
        params.append(hw.toString());
    }

    return (params == null) ? mainType + '/' + subType : mainType + '/'
            + subType + params.toString();
};

MediaType.ALL = MediaType.register("*/*", "All media");
MediaType.APPLICATION_JSON = MediaType.register("application/json", "");
MediaType.APPLICATION_JSONP = MediaType.register("application/jsonp", "");
MediaType.TEXT_JSON = MediaType.register("text/json", "");
MediaType.APPLICATION_XML = MediaType.register("application/xml", "");
MediaType.TEXT_XML = MediaType.register("text/xml", "");
MediaType.TEXT_HTML = MediaType.register("text/html", "");
MediaType.TEXT_PLAIN = MediaType.register("text/plain", "");