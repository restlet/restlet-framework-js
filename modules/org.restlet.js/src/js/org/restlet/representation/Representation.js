var Representation = new [class Class]([class RepresentationInfo], {
	initialize: function() {
	},
    isAvailable: function() {
    	return this.available && (this.getSize() != 0);
    },
    setAvailable: function(available) {
    	this.available = available;
    },
    getAvailableSize: function() {
    	return this.getSize();
    },
    getDisposition: function() {
    	return this.disposition;
    },
    setDisposition: function(disposition) {
    	this.disposition = disposition;
    },
    getExpirationDate: function() {
    	return this.expirationDate;
    },
    setExpirationDate: function(expirationDate) {
    	this.expirationDate = expirationDate;
    },
    getIsTransient: function() {
    	return this.isTransient;
    },
    setIsTransient: function(isTransient) {
    	this.isTransient = isTransient;
    },
    getRange: function() {
    	return this.range;
    },
    setRange: function(range) {
    	this.range = range;
    },
    getSize: function() {
    	return this.size;
    },
    setSize: function(size) {
    	this.size = size;
    },
    getTag: function() {
    	return this.tag;
    },
    setTag: function(tag) {
    	this.tag = tag;
    },
    getText: function() {
		return this.text;
	},
	getXml: function() {
		return this.xml;
	},
	write: function(content) {
		if (typeof content=="string") {
			this.text = content;
			this.setSize(this.text.length);
			this.setAvailable(true);
        // [ifndef nodejs]
		} else if (content instanceof Document) {
		// [enddef]
		// [ifdef nodejs] uncomment
		//} else if (content instanceof libxmljs.Document) {
		// [enddef]
			this.xml = content;
			this.setAvailable(true);
		} else {
			this.text = content.responseText;
			this.setSize(this.text.length);
			this.setAvailable(true);
			this.xml = content.responseXML;
		}
	},
	release: function() {
        this.setAvailable(false);
    },
    isAvailable: function() {
        return this.available && (this.getSize() != 0);
    },
    isEmpty: function() {
        return this.getSize() == 0;
    }
});

Representation.extend({
	UNKNOWN_SIZE: -1
});