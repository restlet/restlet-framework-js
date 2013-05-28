var TunnelService = new [class Class](Service, {
    initialize: function() {
    	var enabled = true;
    	var methodTunnel = false;
    	var preferencesTunnel = false;
    	var queryTunnel = true;
    	var extensionsTunnel = false;
    	var userAgentTunnel = false;
    	var headersTunnel = true;
    	if (arguments.length==2) {
    		methodTunnel = arguments[0];
    		preferencesTunnel = arguments[1];
    	} else if (arguments.length==3) {
    		enabled = arguments[0];
    		methodTunnel = arguments[1];
    		preferencesTunnel = arguments[2];
    	} else if (arguments.length==5) {
    		enabled = arguments[0];
    		methodTunnel = arguments[1];
    		preferencesTunnel = arguments[2];
            queryTunnel = arguments[3];
            extensionsTunnel = arguments[4];
    	} else if (arguments.length==6) {
    		enabled = arguments[0];
    		methodTunnel = arguments[1];
    		preferencesTunnel = arguments[2];
            queryTunnel = arguments[3];
            extensionsTunnel = arguments[4];
            userAgentTunnel = arguments[5];
    	}

    	this.callSuperCstr(enabled);

        this.extensionsTunnel = extensionsTunnel;
        this.methodTunnel = methodTunnel;
        this.preferencesTunnel = preferencesTunnel;
        this.queryTunnel = queryTunnel;
        this.userAgentTunnel = userAgentTunnel;
        this.headersTunnel = headersTunnel;

        this.characterSetParameter = "charset";
        this.encodingParameter = "encoding";
        this.languageParameter = "language";
        this.mediaTypeParameter = "media";
        this.methodParameter = "method";
        this.methodHeader = [class HeaderConstants].HEADER_X_HTTP_METHOD_OVERRIDE;
    },

    allowClient: function(client) {
        return true;
    },

    createInboundFilter: function(context) {
        return new [class TunnelFilter](context);
    },

    getCharacterSetParameter: function() {
        return this.characterSetParameter;
    },

    getEncodingParameter: function() {
        return this.encodingParameter;
    },

    getLanguageParameter: function() {
        return this.languageParameter;
    },

    getMediaTypeParameter: function() {
        return this.mediaTypeParameter;
    },

    getMethodHeader: function() {
        return this.methodHeader;
    },

    getMethodParameter: function() {
        return this.methodParameter;
    },

    isExtensionsTunnel: function() {
        return this.extensionsTunnel;
    },

    isHeadersTunnel: function() {
        return this.headersTunnel;
    },

    isMethodTunnel: function() {
        return this.methodTunnel;
    },

    isPreferencesTunnel: function() {
        return this.preferencesTunnel;
    },

    isQueryTunnel: function() {
        return this.queryTunnel;
    },

    isUserAgentTunnel: function() {
        return this.userAgentTunnel;
    },

    setCharacterSetParameter: function(parameterName) {
        this.characterSetParameter = parameterName;
    },

    setEncodingParameter: function(parameterName) {
        this.encodingParameter = parameterName;
    },

    setExtensionsTunnel: function(extensionTunnel) {
        this.extensionsTunnel = extensionTunnel;
    },

    setHeadersTunnel: function(headersTunnel) {
        this.headersTunnel = headersTunnel;
    },

    setHeaderTunnel: function(headersTunnel) {
        this.setHeadersTunnel(headersTunnel);
    },

    setLanguageParameter: function(parameterName) {
        this.languageParameter = parameterName;
    },

    setMediaTypeParameter: function(parameterName) {
        this.mediaTypeParameter = parameterName;
    },

    setMethodHeader: function(methodHeader) {
        this.methodHeader = methodHeader;
    },

    setMethodParameter: function(parameterName) {
        this.methodParameter = parameterName;
    },

    setMethodTunnel: function(methodTunnel) {
        this.methodTunnel = methodTunnel;
    },

    setPreferencesTunnel: function(boolean preferencesTunnel) {
        this.preferencesTunnel = preferencesTunnel;
    },

    setQueryTunnel: function(queryTunnel) {
        this.queryTunnel = queryTunnel;
    },

    setUserAgentTunnel: function(userAgentTunnel) {
        this.userAgentTunnel = userAgentTunnel;
    }
});