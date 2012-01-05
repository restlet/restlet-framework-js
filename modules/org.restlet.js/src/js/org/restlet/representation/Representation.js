var Representation = new Class(RepresentationInfo, {
	initialize: function() {
	},
    isAvailable: function() {
    	return this.available && (this.getSize() != 0);
    },
    setAvailable: function(available) {
    	this.available = available;
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
    getText: function() {
		return this.text;
	},
	getXml: function() {
		return this.xml;
	},
	write: function(content) {
		if (typeof content=="string") {
			this.text = content;
        // [ifndef nodejs]
		} else if (content instanceof Document) {
		// [enddef]
		// [ifdef nodejs] uncomment
		//} else if (content instanceof libxmljs.Document) {
		// [enddef]
			this.xml = content;
		} else {
			this.text = content.responseText;
			this.xml = content.responseXML;
		}
	}
});