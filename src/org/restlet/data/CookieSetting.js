var CookieSetting = new [class Class](Cookie, {
	initialize: function() {
    	if (arguments.length==2 && typeof arguments[0]=="string") {
    		this.version = 0;
    		this.name = arguments[0];
    		this.value = arguments[1];
    	} else {
    		if (arguments.length>0) {
    			this.version = arguments[0];
    		}
    		if (arguments.length>1) {
    			this.name = arguments[1];
    		}
    		if (arguments.length>2) {
    			this.value = arguments[2];
    		}
    		if (arguments.length>3) {
    			this.path = arguments[3];
    		}
    		if (arguments.length>4) {
    			this.domain = arguments[4];
    		}
    		if (arguments.length>5) {
    			this.comment = arguments[5];
    		}
    		if (arguments.length>6) {
    			this.maxAge = arguments[6];
    		}
    		if (arguments.length>7) {
    			this.secure = arguments[7];
    		}
    		if (arguments.length>8) {
    			this.accessRestricted = arguments[8];
    		}
    	}
    },

    equals: function(obj) {
        var result = (obj == this);

        // if obj == this no need to go further
        if (!result) {
            // test for equality at Cookie level i.e. name and value.
            if (this.callSuper(obj)) {
                // if obj isn't a cookie setting or is null don't evaluate
                // further
                if (obj instanceof CookieSetting) {
                    var that = obj;
                    result = (this.maxAge == that.maxAge)
                            && (this.secure == that.secure);

                    if (result) // if "maxAge" and "secure" properties are equal
                    // test comments
                    {
                        if (!(this.comment == null)) // compare comments
                        // taking care of nulls
                        {
                            result = (this.comment.equals(that.comment));
                        } else {
                            result = (that.comment == null);
                        }
                    }
                }
            }
        }

        return result;
    },

    getComment: function() {
        return this.comment;
    },

    getDescription: function() {
        return "Cookie setting";
    },

    getMaxAge: function() {
        return this.maxAge;
    },

    isAccessRestricted: function() {
        return this.accessRestricted;
    },

    isSecure: function() {
        return this.secure;
    },

    setAccessRestricted: function(accessRestricted) {
        this.accessRestricted = accessRestricted;
    },

    setComment: function(comment) {
        this.comment = comment;
    },

    setMaxAge: function(maxAge) {
        this.maxAge = maxAge;
    },

    setSecure: function(secure) {
        this.secure = secure;
    },

    toString: function() {
        return "CookieSetting [accessRestricted=" + this.accessRestricted
                + ", comment=" + this.comment + ", maxAge=" + this.maxAge + ", secure="
                + this.secure + ", domain=" + this.getDomain() + ", name=" + this.getName()
                + ", path=" + this.getPath() + ", value=" + this.getValue()
                + ", version=" + this.getVersion() + "]";
    }
});