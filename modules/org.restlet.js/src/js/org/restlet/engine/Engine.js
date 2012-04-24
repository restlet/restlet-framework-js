var Engine = new [class Class]({
	initialize: function() {
        this.registeredClients = [];
        this.registeredProtocols = [];
        this.registeredServers = [];
        this.registeredAuthenticators = [];
        this.registeredConverters = [];
	},

	createHelper: function(restlet) {
		return new this.registeredClients[0]();
	},

	getRegisteredClients: function() {
		return this.registeredClients;
	},
	
	setRegisteredClients: function(registeredClients) {
		this.registeredClients = registeredClients;
	},
	
	getDebugHandler: function() {
		return this.debugHandler;
	},

	setDebugHandler: function(debugHandler) {
		this.debugHandler = debugHandler;
	},
	
	enableDebug: function() {
		this.debugHandler = {
			beforeSendingRequest: function(url, method, headers, data) {
				console.log(method+" "+url);
				for (var elt in headers) {
					console.log(elt+": "+headers[elt]);
				}
				console.log("");
				console.log(data);
			},
			afterReceivedResponse: function(status, statusCode, headers, data) {
				console.log(status+" "+statusCode);
				for (var elt in headers) {
					console.log(elt+": "+headers[elt]);
				}
				console.log("");
				console.log(data);
			}
		};
	},

	disableDebug: function() {
		this.debugHandler = null;
	}
});

Engine.extend({
    /*MAJOR_NUMBER: "@major-number@",
    MINOR_NUMBER: "@minor-number@",
    RELEASE_NUMBER: "@release-type@@release-number@",*/
    MAJOR_NUMBER: "2.1",
    MINOR_NUMBER: "2.0",
    RELEASE_NUMBER: "nodejs2.1",
	getInstance: function() {
		if (Engine.instance==null) {
			Engine.instance = new Engine();
		}
		return Engine.instance;
	}
});

Engine.VERSION = Engine.MAJOR_NUMBER + '.' + Engine.MINOR_NUMBER + Engine.RELEASE_NUMBER;
Engine.VERSION_HEADER = "Restlet-Framework/" + Engine.VERSION;