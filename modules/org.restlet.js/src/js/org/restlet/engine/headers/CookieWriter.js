var CookieWriter = new [class Class]([class HeaderWriter], {
	initialize: function() {
		this.callSuperCstr();
	},

	appendObject: function(cookie) {
        var name = cookie.getName();
        var value = cookie.getValue();
        var version = cookie.getVersion();

        if ((name == null) || (name.length == 0)) {
            throw new Error(
                    "Can't write cookie. Invalid name detected");
        }

        this.appendValue(name, 0).append('=');

        // Append the value
        if ((value != null) && (value.length > 0)) {
        	this.appendValue(value, version);
        }

        if (version > 0) {
            // Append the path
            var path = cookie.getPath();

            if ((path != null) && (path.length > 0)) {
            	this.append("; $Path=");
            	this.appendQuotedString(path);
            }

            // Append the domain
            var domain = cookie.getDomain();

            if ((domain != null) && (domain.length > 0)) {
            	this.append("; $Domain=");
            	this.appendQuotedString(domain);
            }
        }

        return this;
    },

    appendCollection: function(cookies) {
        if ((cookies != null) && !cookies.isEmpty()) {
            var cookie;

            var elements = cookies.getElements();
            for (var i = 0; i < elements.length; i++) {
                cookie = elements[i];

                if (i == 0) {
                    if (cookie.getVersion() > 0) {
                    	this.append("$Version=\"").append(cookie.getVersion())
                                .append("\"; ");
                    }
                } else {
                	this.append("; ");
                }

                this.appendObject(cookie);
            }
        }

        return this;
    },

    appendValue: function(value, version) {
        if (version == 0) {
        	this.append(value.toString());
        } else {
        	this.appendQuotedString(value);
        }

        return this;
    }
});

CookieWriter.extend({
	getCookies: function(source, destination) {
	    var cookie;

	    for (var i=0; i<source.length; i++) {
	        cookie = source[i];

	        if (destination.containsKey(cookie.getName())) {
	            destination.put(cookie.getName(), cookie);
	        }
	    }
	},

	writeObject: function(cookie) {
	    return new CookieWriter().appendObject(cookie).toString();
	},

	writeCollection: function(cookies) {
	    return new CookieWriter().appendCollection(cookies).toString();
	}
});