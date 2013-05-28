var Method = new [class Class]({
	initialize: function(name, description, uri, safe, idempotent, replying) {
		this.name = name;
		this.description = description;
		this.uri = uri;
		if (safe!=null) {
			this.safe = safe;
		} else {
			this.safe = false;
		}
		if (idempotent!=null) {
			this.idempotent = idempotent;
		} else {
			this.idempotent = false;
		}
		if (replying!=null) {
			this.replying = replying;
		} else {
			this.replying = true;
		}
	},

	getName: function() {
		return this.name;
	},

	getUri: function() {
        return this.uri;
    },

    isIdempotent: function() {
        return this.idempotent;
    },

    isReplying: function() {
        return this.replying;
    },

    isSafe: function() {
        return this.safe;
    },

    equals: function(status) {
    	return (this.getName()==status.getName());
    },

    toString: function() {
        return this.getName();
    }
});

Method.extend({
    BASE_HTTP: "http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html",
    CONNECT: new Method("CONNECT",
        "Used with a proxy that can dynamically switch to being a tunnel",
        Method.BASE_HTTP + "#sec9.9", false, false),
	DELETE: new Method("DELETE",
	    "Requests that the origin server deletes the resource identified by the request URI",
	    Method.BASE_HTTP + "#sec9.7", false, true),
	GET: new Method("GET",
        "Retrieves whatever information (in the form of an entity) that is identified by the request URI",
        Method.BASE_HTTP + "#sec9.3", true, true),
	HEAD: new Method("HEAD",
        "Identical to GET except that the server must not return a message body in the response",
        Method.BASE_HTTP + "#sec9.4", true, true),
	OPTIONS: new Method("OPTIONS",
        "Requests for information about the communication options available on the request/response chain identified by the URI",
        Method.BASE_HTTP + "#sec9.2", true, true),
	POST: new Method("POST",
        "Requests that the origin server accepts the entity enclosed in the request as a new subordinate of the resource identified by the request URI",
        Method.BASE_HTTP + "#sec9.5", false, false),
	PUT: new Method("PUT",
        "Requests that the enclosed entity be stored under the supplied request URI",
        Method.BASE_HTTP + "#sec9.6", false, true),
	TRACE: new Method("TRACE",
        "Used to invoke a remote, application-layer loop-back of the request message",
        Method.BASE_HTTP + "#sec9.8", true, true),
    valueOf: function(name) {
        var upperCaseName = (new String(name)).toUpperCase();
        var methods = [ Method.CONNECT, Method.DELETE, Method.GET, Method.HEAD,
                        Method.OPTIONS, Method.POST, Method.PUT, Method.TRACE ];
        for (var i=0; i<methods.length; i++) {
        	var method = methods[i];
        	if (method.getName()==upperCaseName) {
        		return method;
        	}
        }
		return null;
    }
});