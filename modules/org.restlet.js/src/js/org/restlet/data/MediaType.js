var MediaTypeUtils = new Class({});
MediaTypeUtils.extend({
    _TSPECIALS: "()<>@,;:/[]?=\\\"",

    normalizeToken: function(token) {
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
            if (c <= 32 || c >= 127 || MediaTypeUtils._TSPECIALS.indexOf(c) != -1)
                throw new ERROR("Illegal token: " + token);
        }

        return token;
    },

	normalizeType: function(name, parameters) {
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
            params = new StringBuilder(name.substring(colonIndex));
            name = name.substring(0, colonIndex);
        }

        // No main / sub separator, assumes name/*.
        if ((slashIndex = name.indexOf('/')) == -1) {
            mainType = MediaTypeUtils.normalizeToken(name);
            subType = "*";
        } else {
            // Normalizes the main and sub types.
            mainType = MediaTypeUtils.normalizeToken(name.substring(0, slashIndex));
            subType = MediaTypeUtils.normalizeToken(name.substring(slashIndex + 1));
        }

        // Merge parameters taken from the name and the method argument.
        if (parameters != null && !parameters.isEmpty()) {
            if (params == null) {
                params = new StringBuilder();
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
    }
});

var MediaType = new Class(Metadata, {
	initialize: function(name, parameters, description) {
		if (description==null) {
			description = "Media type or range of media types";
		}
        this.callSuper(MediaTypeUtils.normalizeType(name, parameters), description);
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
    }
});

MediaType.extend({
	APPLICATION_JSON: new MediaType("application/json"),
	TEXT_JSON: new MediaType("text/json"),
	APPLICATION_XML: new MediaType("application/xml"),
	TEXT_XML: new MediaType("text/xml"),
    _TSPECIALS: "()<>@,;:/[]?=\\\"",

    normalizeToken: function(token) {
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
                throw new ERROR("Illegal token: " + token);
        }

        return token;
    },

	normalizeType: function(name, parameters) {
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
            params = new StringBuilder(name.substring(colonIndex));
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
                params = new StringBuilder();
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
    }
});