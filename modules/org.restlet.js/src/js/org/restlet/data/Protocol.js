var Protocol = new [class Class]({
	initialize: function(schemeName,name,technicalName,description,
						defaultPort,confidential,version) {
		this.schemeName = schemeName;
		this.name = name;
		this.technicalName = technicalName;
        this.description = description;
        this.defaultPort = defaultPort;
        this.confidential = confidential;
        this.version = version;
	},
	
    equals: function(object) {
        return (object instanceof Protocol)
                && this.getName().equalsIgnoreCase(this.getName());
    },

    getDefaultPort: function() {
        return this.defaultPort;
    },

    getDescription: function() {
        return this.description;
    },

    getName: function() {
        return this.name;
    },

    getSchemeName: function() {
        return this.schemeName;
    },

    getTechnicalName: function() {
        return this.technicalName;
    },

    getVersion: function() {
        return this.version;
    },

    isConfidential: function() {
        return this.confidential;
    },

    toString: function() {
        return this.getName() + ((this.getVersion() == null) ? "" : "/" + this.getVersion());
    }
});

Protocol.extend({
	HTTP: new Protocol("http", "HTTP",
        "HyperText Transport Protocol", 80, false, "1.1"),
    HTTPS: new Protocol("https", "HTTPS", "HTTP",
        "HyperText Transport Protocol (Secure)", 443, true, "1.1")
});