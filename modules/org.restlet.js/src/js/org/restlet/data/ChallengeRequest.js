var ChallengeRequest = new [class Class](ChallengeMessage, {
	initialize: function(scheme, realm) {
		this.callSuper(scheme, realm);
	    this.domainRefs = null;
	    this.qualityOptions = null;
	    this.stale = false;
	},

    equals: function(obj) {
        var result = (obj == this);

        // if obj == this no need to go further
        if (!result) {
            // if obj isn't a challenge request or is null don't evaluate
            // further
            if (obj instanceof ChallengeRequest) {
                var that = obj;
                result = (this.getParameters().equals(that.getParameters()));

                if (result) {
                    if (this.getRealm() != null) {
                        result = this.getRealm().equals(that.getRealm());
                    } else {
                        result = (that.getRealm() == null);
                    }

                    if (result) {
                        if (this.getScheme() != null) {
                            result = this.getScheme().equals(that.getScheme());
                        } else {
                            result = (that.getScheme() == null);
                        }
                    }
                }
            }
        }

        return result;
    },

    getDomainRefs: function() {
        if (this.domainRefs == null) {
        	this.domainRefs = [];
        	this.domainRefs.push(new Reference("/"));
        }
        return this.domainRefs;
    },

    getQualityOptions: function() {
        if (this.qualityOptions == null) {
        	this.qualityOptions = [];
        	this.qualityOptions.push(QUALITY_AUTHENTICATION);
        }
        return this.qualityOptions;
    },

    isStale: function() {
        return this.stale;
    },

    setDomainRefs: function(domainRefs) {
        this.domainRefs = domainRefs;
    },

    setDomainUris: function(domainUris) {
        var domainRefs = null;

        if (domainUris != null) {
            domainRefs = [};

            for (var i=0; i<domainUris.length; i++) {
            	var domainUri = domainUris[i];
                domainRefs.add(new Reference(domainUri));
            }
        }

        this.setDomainRefs(domainRefs);
    },

    setQualityOptions: function(qualityOptions) {
        this.qualityOptions = qualityOptions;
    },

    setStale: function(stale) {
        this.stale = stale;
    }
});