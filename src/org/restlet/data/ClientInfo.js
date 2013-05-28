var ClientInfo = new [class Class]({
	initialize: function() {
        this.address = null;
        this.agent = null;
        this.port = -1;
        this.acceptedCharacterSets = [];
        this.acceptedEncodings = [];
        this.acceptedLanguages = [];
		this.acceptedMediaTypes = [];
		if (arguments.length==1 && arguments[0] instanceof MediaType) {
			this.acceptedMediaTypes.push(new Preference(arguments[0]));
		}
        this.forwardedAddresses = [];
        this.from = null;

        //private volatile Map<String, String> agentAttributes;
        //private volatile Product agentMainProduct;
        //private volatile List<Product> agentProducts;
        this.authenticated = false;
        //private volatile List<java.security.cert.Certificate> certificates;
        //private volatile String cipherSuite;
        this.expectations = [];
        //private volatile List<java.security.Principal> principals;
        //private volatile List<org.restlet.security.Role> roles;
        //private volatile org.restlet.security.User user;
	},
	
	accept: function() {
		if (arguments.length==1) {
			_acceptList.accept(arguments[0]);
		} else if (arguments.length==2) {
			_acceptSingleElement.accept(arguments[0], arguments[1]);
		}
	},
	
    _acceptList: function(metadata) {
        if (metadata != null) {
            for (var i=0;i<metadata.length;i++) {
            	var md = metadata[i]; 
                this._acceptSingleElement(md, 1.0);
            }
        }
    },

    _acceptSingleElement: function(metadata, quality) {
        if (metadata instanceof [class MediaType]) {
            this.getAcceptedMediaTypes().add(
                    new [class Preference](metadata, quality));
        } else if (metadata instanceof [class Language]) {
        	this.getAcceptedLanguages().add(
                    new [class Preference](metadata, quality));
        } else if (metadata instanceof [class Encoding]) {
        	this.getAcceptedEncodings().add(
                    new [class Preference](metadata, quality));
        } else {
        	this.getAcceptedCharacterSets().add(
                    new [class Preference](metadata, quality));
        }
    },
    
    getAddress: function() {
		return this.address;
	},
    setAddress: function(address) {
		this.address = address;
	},
	getAgent: function() {
		return this.agent;
	},
	setAgent: function(agent) {
		this.agent = agent;
	},
	getPort: function() {
		return this.port;
	},
	setPort: function(port) {
		this.port = port;
	},
	getAcceptedCharacterSets: function() {
		return this.acceptedCharacterSets;
	},
	setAcceptedCharacterSets: function(acceptedCharacterSets) {
		this.acceptedCharacterSets = acceptedCharacterSets;
	},
	getAcceptedEncodings: function() {
		return this.acceptedEncodings;
	},
	setAcceptedEncodings: function(acceptedEncodings) {
		this.acceptedEncodings = acceptedEncodings;
	},
	getAcceptedLanguages: function() {
		return this.acceptedLanguages;
	},
	setAcceptedLanguages: function(acceptedLanguages) {
		this.acceptedLanguages = acceptedLanguages;
	},
	getAcceptedMediaTypes: function() {
		return this.acceptedMediaTypes;
	},
	setAcceptedMediaTypes: function(acceptedMediaTypes) {
		this.acceptedMediaTypes = acceptedMediaTypes;
	},
	getForwardedAddresses: function() {
		return this.forwardedAddresses;
	},
	setForwardedAddresses: function(forwardedAddresses) {
		this.forwardedAddresses = forwardedAddresses;
	},
    getExpectations: function() {
    	return this.expectations;
    },
    setExpectations: function(expectations) {
    	this.expectations = expectations;
    },
	getFrom: function() {
	    return this.from;
	},
	setFrom: function(from) {
	    this.from = from;
	}
});