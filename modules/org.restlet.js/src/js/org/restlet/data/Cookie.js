var Cookie = new Class({
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
    	}
    },

    equals: function(obj) {
        // if obj == this no need to go further
        var result = (obj == this);

        if (!result) {
            result = obj instanceof Cookie;

            // if obj isn't a cookie or is null don't evaluate further
            if (result) {
                var that = obj;
                result = (((that.getName() == null) && (this.getName() == null)) || ((this.getName() != null) && this.getName()
                        .equals(that.getName())));

                // if names are both null or equal continue
                if (result) {
                    result = (((that.getValue() == null) && (this.getValue() == null)) || ((this.getValue() != null) && this.getValue()
                            .equals(that.getValue())));

                    // if values are both null or equal continue
                    if (result) {
                        result = (this.version == that.version);

                        // if versions are equal continue
                        if (result) {
                            result = (((that.getDomain() == null) && (this.getDomain() == null)) || ((this.getDomain() != null) && this.getDomain()
                                    .equals(that.getDomain())));

                            // if domains are equal continue
                            if (result) {
                                // compare paths taking
                                result = (((that.getPath() == null) && (this.getPath() == null)) || ((this.getPath() != null) && this.getPath()
                                        .equals(that.getPath())));
                            }
                        }
                    }
                }
            }
        }

        return result;
    },

    getDomain: function() {
        return this.domain;
    },

    getName: function() {
        return this.name;
    },

    getPath: function() {
        return this.path;
    },

    getValue: function() {
        return this.value;
    },

    getVersion: function() {
        return this.version;
    },

    setDomain: function(domain) {
        this.domain = domain;
    },

    setName: function(name) {
        this.name = name;
    },

    setPath: function(path) {
        this.path = path;
    },

    setValue: function(value) {
        this.value = value;
    },

    setVersion: function(version) {
        this.version = version;
    },

    toString: function() {
        return "Cookie [domain=" + this.domain + ", name=" + this.name + ", path=" + this.path
                + ", value=" + this.value + ", version=" + this.version + "]";
    }
});