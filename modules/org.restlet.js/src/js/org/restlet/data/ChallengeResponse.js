var ChallengeResponse = new Class(ChallengeMessage, {
	initialize: function(scheme, identifier, secret) {
		this.scheme = scheme;
		this.identifier = identifier;
		this.secret = secret;
	},

    equals: function(obj) {
        var result = (obj == this);

        // if obj == this no need to go further
        if (!result) {
            // if obj isn't a challenge request or is null don't evaluate
            // further
            if (obj instanceof ChallengeResponse) {
                var that = obj;

                if (getRawValue() != null) {
                    result = this.getRawValue().equals(that.getRawValue());
                } else {
                    result = (that.getRawValue() == null);
                }

                if (result) {
                    if (this.getIdentifier() != null) {
                        result = this.getIdentifier().equals(that.getIdentifier());
                    } else {
                        result = (that.getIdentifier() == null);
                    }

                    if (result) {
                        if (this.getScheme() != null) {
                            result = this.getScheme().equals(that.getScheme());
                        } else {
                            result = (that.getScheme() == null);
                        }

                        if (result) {
                            if ((this.getSecret() == null)
                                    || (that.getSecret() == null)) {
                                // check if both are null
                                result = (this.getSecret() == that.getSecret());
                            } else {
                                if (this.getSecret().length == that.getSecret().length) {
                                    var equals = true;
                                    for (var i = 0; (i < this.getSecret().length)
                                            && equals; i++) {
                                        equals = (this.getSecret()[i] == that
                                                .getSecret()[i]);
                                    }
                                    result = equals;
                                }
                            }
                        }
                    }
                }
            }
        }

        return result;
    },

    getClientNonce: function() {
        return this.clientNonce;
    },

    getDigestRef: function() {
        return this.digestRef;
    },

    getIdentifier: function() {
        return this.identifier;
    },

    getQuality: function() {
        return this.quality;
    },

    getSecret: function() {
        return this.secret;
    },

    getSecretAlgorithm: function() {
        return this.secretAlgorithm;
    },

    getServerNounceCount: function() {
        return this.serverNounceCount;
    },

    getTimeIssued: function() {
        return this.timeIssued;
    },

    setClientNonce: function(clientNonce) {
        this.clientNonce = clientNonce;
    },

    setDigestRef: function(digestRef) {
        this.digestRef = digestRef;
    },

    setIdentifier: function(identifier) {
        this.identifier = identifier;
    },

    setQuality: function(quality) {
        this.quality = quality;
    },

    setSecret: function(secret) {
        this.secret = secret;
    },

    setSecretAlgorithm: function(secretDigestAlgorithm) {
        this.secretAlgorithm = secretDigestAlgorithm;
    },

    setServerNounceCount: function(serverNounceCount) {
        this.serverNounceCount = serverNounceCount;
    },

    setTimeIssued: function(timeIssued) {
        this.timeIssued = timeIssued;
    }
});