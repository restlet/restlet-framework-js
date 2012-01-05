var Protocol = new Class({
	initialize: function(schemeName,name,technicalName,description,
						defaultPort,confidential,version) {
		this.schemeName = schemeName;
		this.name = name;
		this.technicalName = technicalName;
        this.description = description;
        this.defaultPort = defaultPort;
        this.confidential = confidential;
        this.version = version;
	}
});

Protocol.extend({
	HTTP: new Protocol("http", "HTTP",
        "HyperText Transport Protocol", 80, false, "1.1"),
    HTTPS: new Protocol("https", "HTTPS", "HTTP",
        "HyperText Transport Protocol (Secure)", 443, true, "1.1")
});