var Message = new Class({
	initialize: function(entity) {
    	this.attributes = null;
    	this.cacheDirectives = null;
    	this.date = null;
    	this.entity = entity;
    	this.entityText = null;
    	this.recipientsInfo = null;
	},

	getAttributes: function() {
		if (this.attributes==null) {
			this.attributes = {};
		}
		return this.attributes;
	}, 

	getCacheDirectives: function() {
		if (this.cacheDirectives==null) {
			this.cacheDirectives = [];
		}
		return this.cacheDirectives;
	}, 

	getDate: function() {
		return this.date;
	},

	getEntity: function() {
		return this.entity;
	},

	getEntityAsText: function() {
        if (this.entityText == null) {
            this.entityText = (this.getEntity() == null) ? null : this.getEntity()
                        .getText();
        }
        return this.entityText;
    },

    getRecipientsInfo: function() {
		if (this.recipientsInfo==null) {
			this.recipientsInfo = [];
		}
		return this.recipientsInfo;
	},

	getWarnings: function() {
		if (this.warnings==null) {
			this.warnings = [];
		}
		return this.warnings;
	},

    isConfidential: function() {
    	return false;
    },

    isEntityAvailable: function() {
        return (this.getEntity() != null) && this.getEntity().isAvailable();
    },

    release: function() {
        if (this.getEntity() != null) {
        	this.getEntity().release();
        }
    },

	setAttributes: function(attributes) {
		this.attributes = attributes;
	},

	setCacheDirectives: function(cacheDirectives) {
		this.cacheDirectives = cacheDirectives;
	}, 

	setDate: function(date) {
		this.date = date;
	},

	setEntity: function(entity) {
		if (arguments.length==1) {
			var entity = arguments[0];
			this.entity = entity;
		} else if (arguments.length==2) {
			var value = arguments[0];
			var mediaType = arguments[1];
			this.entity = new StringRepresentation(value, mediaType);
		}
	},

	setRecipientsInfo: function(recipientsInfo) {
		this.recipientsInfo = recipientsInfo;
	}, 

	setWarnings: function(warnings) {
		this.warnings = warnings;
	}
});