var Message = new Class({
	initialize: function() {
    	this.attributes = {};
    	this.cacheDirectives = null;
    	this.date = null;
    	this.entity = null;
    	this.entityText = null;
    	this.recipientsInfo = null;
	},
	getEntity: function() {
		return this.entity;
	},
	setEntity: function(entity) {
		this.entity = entity;
	},
    getEntityAsText: function() {
        if (this.entityText == null) {
            this.entityText = (this.getEntity() == null) ? null : this.getEntity()
                        .getText();
        }
        return this.entityText;
    },
	getAttributes: function() {
		return this.attributes;
	}, 
	setAttributes: function(attributes) {
		this.attributes = attributes;
	},
	//this.cacheDirectives = null;
	getDate: function() {
		return this.date;
	},
	setDate: function(date) {
		this.date = date;
	}
	//this.recipientsInfo = null;
});