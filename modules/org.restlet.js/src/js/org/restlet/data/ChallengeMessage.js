var ChallengeMessage = new Class({
	initialize: function(scheme, realm, parameters,
    					digestAlgorithm, opaque, serverNonce) {
        this.parameters = parameters;
        this.scheme = scheme;
        this.serverNonce = serverNonce;
        this.realm = realm;
        this.opaque = opaque;
        this.digestAlgorithm = digestAlgorithm;
    },

    getDigestAlgorithm: function() {
        return this.digestAlgorithm;
    },

    getOpaque: function() {
        return this.opaque;
    },

    //Series<Parameter>
    getParameters: function() {
        if (this.parameters == null) {
            this.parameters = new Series();
        }

        return this.parameters;
    },

    getRawValue: function() {
        return this.rawValue;
    },

    getRealm: fuction() {
        return this.realm;
    },

    getScheme: function() {
        return this.scheme;
    },

    getServerNonce: function() {
        return this.serverNonce;
    },

    setDigestAlgorithm: function(digestAlgorithm) {
        this.digestAlgorithm = digestAlgorithm;
    },

    setOpaque: function(opaque) {
        this.opaque = opaque;
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setRawValue: function(rawValue) {
        this.rawValue = rawValue;
    },

    setRealm: function(realm) {
        this.realm = realm;
    },

    setScheme: function(scheme) {
        this.scheme = scheme;
    },

    setServerNonce: function(serverNonce) {
        this.serverNonce = serverNonce;
    }
});

ChallengeMessage.extend({
	QUALITY_AUTHENTICATION: "auth",
	QUALITY_AUTHENTICATION_INTEGRITY = "auth-int"
});