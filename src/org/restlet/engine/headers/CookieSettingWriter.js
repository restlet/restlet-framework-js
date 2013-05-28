var CookieSettingWriter = new [class Class]([class HeaderWriter], {
	initialize: function() {
		this.callSuperCstr();
	},

    appendObject: function(cookieSetting) {
        var name = cookieSetting.getName();
        var value = cookieSetting.getValue();
        var version = cookieSetting.getVersion();

        if ((name == null) || (name.length == 0)) {
            throw new Error(
                    "Can't write cookie. Invalid name detected");
        }

        this.append(name).append('=');

        // Append the value
        if ((value != null) && (value.length > 0)) {
        	this.appendValue(value, version);
        }

        // Append the version
        if (version > 0) {
        	this.append("; Version=");
        	this.appendValue(version.toString(), version);
        }

        // Append the path
        var path = cookieSetting.getPath();

        if ((path != null) && (path.length > 0)) {
        	this.append("; Path=");

            if (version == 0) {
            	this.append(path);
            } else {
            	this.appendQuotedString(path);
            }
        }

        // Append the expiration date
        var maxAge = cookieSetting.getMaxAge();

        if (maxAge >= 0) {
            if (version == 0) {
                var currentTime = (new Date()).getTime();
                var maxTime = (maxAge * 1000);
                var expiresTime = currentTime + maxTime;
                var expires = new Date(expiresTime);

                this.append("; Expires=");
                this.appendValue(DateUtils.format(expires, DateUtils.FORMAT_RFC_1036
                        .get(0)), version);
            } else {
            	this.append("; Max-Age=");
            	this.appendValue(cookieSetting.getMaxAge().toString(),
                        version);
            }
        } else if ((maxAge == -1) && (version > 0)) {
            // Discard the cookie at the end of the user's session (RFC
            // 2965)
        	this.append("; Discard");
        } else {
            // NetScape cookies automatically expire at the end of the
            // user's session
        }

        // Append the domain
        var domain = cookieSetting.getDomain();

        if ((domain != null) && (domain.length > 0)) {
        	this.append("; Domain=");
        	this.appendValue(domain.toLowerCase(), version);
        }

        // Append the secure flag
        if (cookieSetting.isSecure()) {
        	this.append("; Secure");
        }

        // Append the secure flag
        if (cookieSetting.isAccessRestricted()) {
        	this.append("; HttpOnly");
        }

        // Append the comment
        if (version > 0) {
            var comment = cookieSetting.getComment();

            if ((comment != null) && (comment.length > 0)) {
            	this.append("; Comment=");
            	this.appendValue(comment, version);
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

CookieSettingWriter.extend({
	write: function() {
		if (arguments[0] instanceof Array) {
			var cookieSettings = arguments[0];
			return new CookieSettingWriter().appendCollection(cookieSettings).toString();
		} else {
			var cookieSetting = arguments[0];
			return new CookieSettingWriter().appendObject(cookieSetting).toString();
		}
	}
});