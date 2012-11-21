var Context = new [class Class]({
	initialize: function() {
    	var logger = null;
    	if (arguments.length==0) {
    		//logger = [class Engine].getLogger("org.restlet");
    		logger = new Logger("org.restlet");
    	} else if (arguments.length==1 && typeof arguments[0] == "string") {
    		var loggerName = arguments[0];
    		//logger = [class Engine].getLogger(loggerName);
    		logger = new Logger(loggerName);
    	} else {
    		logger = arguments[0];
    	}
        this.attributes = {};
        this.logger = logger;
        this.parameters = new [class Series]();
        this.clientDispatcher = null;

        //this.defaultEnroler = null;
        this.serverDispatcher = null;
        //this.defaultVerifier = null;
    },

    createChildContext: function() {
        return new [class ChildContext](this);
    },

    getAttributes: function() {
        return this.attributes;
    },

    getClientDispatcher: function() {
        return this.clientDispatcher;
    },

    /*public org.restlet.security.Enroler getDefaultEnroler() {
        return defaultEnroler;
    }*/

    /*public org.restlet.security.Verifier getDefaultVerifier() {
        return this.defaultVerifier;
    }*/

    getLogger: function() {
        return this.logger;
    },

    getParameters: function() {
        return this.parameters;
    },

    getServerDispatcher: function() {
        return this.serverDispatcher;
    },

    setAttributes: function(attributes) {
        if (attributes != getAttributes()) {
            this.getAttributes().clear();

            if (attributes != null) {
            	this.getAttributes().putAll(attributes);
            }
        }
    },

    setClientDispatcher: function(clientDispatcher) {
        this.clientDispatcher = clientDispatcher;
    },

    /*public void setDefaultEnroler(org.restlet.security.Enroler enroler) {
        this.defaultEnroler = enroler;
    }*/

    /*public void setDefaultVerifier(org.restlet.security.Verifier verifier) {
        this.defaultVerifier = verifier;
    }*/

    /*public void setLogger(Logger logger) {
        this.logger = logger;
    }

    public void setLogger(String loggerName) {
        setLogger(Engine.getLogger(loggerName));
    }*/

    setParameters: function(parameters) {
        if (parameters != getParameters()) {
            getParameters().clear();

            if (parameters != null) {
                getParameters().addAll(parameters);
            }
        }
    },

    setServerDispatcher: function(serverDispatcher) {
        this.serverDispatcher = serverDispatcher;
    }
});

Context.extend({
	getCurrentLogger: function() {
		return new Logger("org.restlet");
	}
});

var Logger = new [class Class]({
	initialize: function(loggerName) {
		this.loggerName = loggerName;
	},
	log: function(level, message, err) {
		console.log("["+level+"] "+message);
		if (err) {
			console.log(err.stack);
		}
	},
	
	warning: function(message, err) {
		this.log(Level.WARNING, message, err);
	},
	
	fine: function(message, err) {
		this.log(Level.FINE, message, err);
	}
})

var Level = new [class Class]();

Level.extend({
	SEVERE: "severe",
	WARNING: "warning",
	INFO: "info",
	FINE: "fine"
})