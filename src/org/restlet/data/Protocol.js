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
        "HyperText Transport Protocol (Secure)", 443, true, "1.1"),

	valueOf: function(name) {
        var result = null;

        if ((name != null) && !name.equals("")) {
            /*if (name.equalsIgnoreCase(Protocol.AJP.getSchemeName())) {
                result = AJP;
            } else if (name.equalsIgnoreCase(Protocol.CLAP.getSchemeName())) {
                result = CLAP;
            } else if (name.equalsIgnoreCase(Protocol.FILE.getSchemeName())) {
                result = FILE;
            } else if (name.equalsIgnoreCase(Protocol.FTP.getSchemeName())) {
                result = FTP;
            } else */if (name.equalsIgnoreCase(Protocol.HTTP.getSchemeName())) {
                result = Protocol.HTTP;
            } else if (name.equalsIgnoreCase(Protocol.HTTPS.getSchemeName())) {
                result = Protocol.HTTPS;
            /*} else if (name.equalsIgnoreCase(Protocol.JAR.getSchemeName())) {
                result = JAR;
            } else if (name.equalsIgnoreCase(Protocol.JDBC.getSchemeName())) {
                result = JDBC;
            } else if (name.equalsIgnoreCase(Protocol.POP.getSchemeName())) {
                result = POP;
            } else if (name.equalsIgnoreCase(Protocol.POPS.getSchemeName())) {
                result = POPS;
            } else if (name.equalsIgnoreCase(Protocol.RIAP.getSchemeName())) {
                result = RIAP;
            } else if (name.equalsIgnoreCase(Protocol.SMTP.getSchemeName())) {
                result = SMTP;
            } else if (name.equalsIgnoreCase(Protocol.SMTPS.getSchemeName())) {
                result = SMTPS;
            } else if (name.equalsIgnoreCase(Protocol.SIP.getSchemeName())) {
                result = SIP;
            } else if (name.equalsIgnoreCase(Protocol.SIPS.getSchemeName())) {
                result = SIPS;
            } else if (name.equalsIgnoreCase(Protocol.ZIP.getSchemeName())) {
                result = ZIP;*/
            } else {
                result = new Protocol(name);
            }
        }

        return result;
    }
});