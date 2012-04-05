var Preference = new [class Class]({
	initialize: function(metadata, quality, parameters) {
        this.metadata = metadata;
        if (quality==null) {
        	this.quality = 1;
        } else {
        	this.quality = quality;
        }
        
        this.parameters = parameters;
	},

    getMetadata: function() {
        return this.metadata;
    },

    getParameters: function() {
        if (this.parameters == null) {
        	this.parameters = new [class Series]();
        }
        return this.parameters;
    },

    getQuality: function() {
        return this.quality;
    },

    setMetadata: function(metadata) {
        this.metadata = metadata;
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setQuality: function(quality) {
        this.quality = quality;
    },

    toString: function() {
        return (this.getMetadata() == null) ? ""
                : (this.getMetadata().getName() + ":" + this.getQuality());
    }
});