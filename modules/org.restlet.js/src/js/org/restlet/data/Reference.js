var Reference = new Class({
	initialize: function(urlString) {
        // [ifndef nodejs]
		this.url = urlString;
		var tmp = this.url;
		var index = tmp.indexOf("://");
		if (index!=-1) {
			this.protocol = tmp.substring(0, index);
			tmp = tmp.substring(index+3);
		}
		index = tmp.indexOf(":");
		if (index!=-1) {
			this.host = tmp.substring(0, index);
			tmp = tmp.substring(index+1);
		} else if (this.protocol=="http") {
			this.port = 80;
			this.tmp = "/";
		} else if (this.protocol=="https") {
			this.port = 443;
			this.tmp = "/";
		}
		index = tmp.indexOf("/");
		if (index!=-1) {
			this.port = parseInt(tmp.substring(0, index));
			tmp = tmp.substring(index);
			this.path = tmp;
		}
		// [enddef]
		// [ifdef nodejs] uncomment
		//var urlDetails = url.parse(urlString);
		//this.protocol = urlDetails.protocol;
		//var index = -1;
		//if ((index = this.protocol.indexOf(":"))!=-1) {
		//	this.protocol = this.protocol.substring(0, index);
		//}
		//this.host = urlDetails.hostname;
		//this.port = urlDetails.port;
		//if (typeof port=="undefined") {
		//	if (this.protocol=="http") {
		//		this.port = 80;
		//	} else if (this.protocol=="http") {
		//		this.port = 443;
		//	}
		//}
		//this.path = urlDetails.pathname;
		//console.log("this.protocol = "+this.protocol);
		//console.log("this.host = "+this.host);
		//console.log("this.port = "+this.port);
		//console.log("this.path = "+this.path);
		// [enddef]
	},
	getUrl: function() {
		return this.url;
	},
	getScheme: function() {
		return this.scheme;
	},
	getPort: function() {
		return this.port;
	},
	getHost: function() {
		return this.host;
	},
	getPath: function() {
		return this.path;
	},

	addQueryParameter: function() {
		var name = null;
		var value = null;
		if (arguments.length==1) {
			name = arguments[0].getName();
			value = arguments[0].getValue();
		} else if (arguments.length==2) {
			name = arguments[0];
			value = arguments[1];
		}
		
		var query = this.getQuery();

        if (query == null) {
            if (value == null) {
            	this.setQuery(Reference.encode(name));
            } else {
            	this.setQuery(Reference.encode(name) + '=' + Reference.encode(value));
            }
        } else {
            if (value == null) {
            	this.setQuery(query + '&' + Reference.encode(name));
            } else {
                this.setQuery(query + '&' + Reference.encode(name) + '=' + Reference.encode(value));
            }
        }

        return this;
    },

    addQueryParameters: function(parameters) {
        for (var i=0; i<parameters.length; i++) {
        	var param = parameters[i];
            this.addQueryParameter(param);
        }

        return this;
    },

    addSegment: function(value) {
        var path = this.getPath();

        if (value != null) {
            if (path == null) {
                this.setPath("/" + value);
            } else {
                if (path.endsWith("/")) {
                	this.setPath(path + Reference.encode(value));
                } else {
                	this.setPath(path + "/" + Reference.encode(value));
                }
            }
        }

        return this;
    }
});

Reference.extend({
	
/*    private static final boolean[] charValidityMap = new boolean[127];

    static {
        // Initialize the map of valid characters.
        for (int character = 0; character < 127; character++) {
            charValidityMap[character] = isReserved(character)
                    || isUnreserved(character) || (character == '%');
        }
    }

    public static String decode(String toDecode) {
        return decode(toDecode, CharacterSet.UTF_8);
    }

    public static String decode(String toDecode, CharacterSet characterSet) {
        if (Edition.CURRENT == Edition.GWT) {
            if (!CharacterSet.UTF_8.equals(characterSet)) {
                throw new IllegalArgumentException(
                        "Only UTF-8 URL encoding is supported under GWT");
            }
        }
        String result = null;
        // [ifndef gwt]
        try {
            result = (characterSet == null) ? toDecode : java.net.URLDecoder
                    .decode(toDecode, characterSet.getName());
        } catch (UnsupportedEncodingException uee) {
            Context.getCurrentLogger()
                    .log(Level.WARNING,
                            "Unable to decode the string with the UTF-8 character set.",
                            uee);
        }
        // [enddef]

        // [ifdef gwt] uncomment
        // try {
        // result = (characterSet == null) ? toDecode :
        // com.google.gwt.http.client.URL.decodeComponent(toDecode);
        // } catch (NullPointerException npe) {
        // System.err
        // .println("Unable to decode the string with the UTF-8 character set.");
        // }

        // [enddef]

        return result;
    }

    public static String encode(String toEncode) {
        return encode(toEncode, true, CharacterSet.UTF_8);
    }

    public static String encode(String toEncode, boolean queryString) {
        return encode(toEncode, queryString, CharacterSet.UTF_8);
    }

    public static String encode(String toEncode, boolean queryString,
            CharacterSet characterSet) {
        if (Edition.CURRENT == Edition.GWT) {
            if (!CharacterSet.UTF_8.equals(characterSet)) {
                throw new IllegalArgumentException(
                        "Only UTF-8 URL encoding is supported under GWT");
            }
        }

        String result = null;

        // [ifndef gwt]
        try {
            result = (characterSet == null) ? toEncode : java.net.URLEncoder
                    .encode(toEncode, characterSet.getName());
        } catch (UnsupportedEncodingException uee) {
            Context.getCurrentLogger()
                    .log(Level.WARNING,
                            "Unable to encode the string with the UTF-8 character set.",
                            uee);
        }
        // [enddef]

        // [ifdef gwt] uncomment
        // try {
        // result = (characterSet == null) ? toEncode :
        // com.google.gwt.http.client.URL.encodeComponent(toEncode);
        // } catch (NullPointerException npe) {
        // System.err
        // .println("Unable to encode the string with the UTF-8 character set.");
        // }
        // [enddef]

        if (queryString) {
            result = result.replace("+", "%20").replace("*", "%2A")
                    .replace("%7E", "~");
        }

        return result;
    }

    public static String encode(String toEncode, CharacterSet characterSet) {
        return encode(toEncode, true, characterSet);
    }

    private static boolean isAlpha(int character) {
        return isUpperCase(character) || isLowerCase(character);
    }

    private static boolean isDigit(int character) {
        return (character >= '0') && (character <= '9');
    }

    public static boolean isGenericDelimiter(int character) {
        return (character == ':') || (character == '/') || (character == '?')
                || (character == '#') || (character == '[')
                || (character == ']') || (character == '@');
    }

    private static boolean isLowerCase(int character) {
        return (character >= 'a') && (character <= 'z');
    }

    public static boolean isReserved(int character) {
        return isGenericDelimiter(character) || isSubDelimiter(character);
    }

    public static boolean isSubDelimiter(int character) {
        return (character == '!') || (character == '$') || (character == '&')
                || (character == '\'') || (character == '(')
                || (character == ')') || (character == '*')
                || (character == '+') || (character == ',')
                || (character == ';') || (character == '=');
    }

    public static boolean isUnreserved(int character) {
        return isAlpha(character) || isDigit(character) || (character == '-')
                || (character == '.') || (character == '_')
                || (character == '~');
    }

    private static boolean isUpperCase(int character) {
        return (character >= 'A') && (character <= 'Z');
    }

    public static boolean isValid(int character) {
        return character >= 0 && character < 127 && charValidityMap[character];
    }

    public static String toString(String scheme, String hostName,
            Integer hostPort, String path, String query, String fragment) {
        String host = hostName;

        // Appends the host port number
        if (hostPort != null) {
            final int defaultPort = Protocol.valueOf(scheme).getDefaultPort();
            if (hostPort != defaultPort) {
                host = hostName + ':' + hostPort;
            }
        }

        return toString(scheme, host, path, query, fragment);
    }

    public static String toString(String relativePart, String query,
            String fragment) {
        final StringBuilder sb = new StringBuilder();

        // Append the path
        if (relativePart != null) {
            sb.append(relativePart);
        }

        // Append the query string
        if (query != null) {
            sb.append('?').append(query);
        }

        // Append the fragment identifier
        if (fragment != null) {
            sb.append('#').append(fragment);
        }

        // Actually construct the reference
        return sb.toString();
    }

    public static String toString(String scheme, String host, String path,
            String query, String fragment) {
        final StringBuilder sb = new StringBuilder();

        if (scheme != null) {
            // Append the scheme and host name
            sb.append(scheme.toLowerCase()).append("://").append(host);
        }

        // Append the path
        if (path != null) {
            sb.append(path);
        }

        // Append the query string
        if (query != null) {
            sb.append('?').append(query);
        }

        // Append the fragment identifier
        if (fragment != null) {
            sb.append('#').append(fragment);
        }

        // Actually construct the reference
        return sb.toString();
    }*/

});