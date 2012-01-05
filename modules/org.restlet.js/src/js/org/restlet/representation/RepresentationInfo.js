var RepresentationInfo = new Class(Variant, {
    getModificationDate: function() {
    	return this.modificationDate;
    },
    setModificationDate: function(date) {
    	this.modificationDate = date;
    },
    getTag: function() {
    	return this.tag;
    },
    setTag: function(tag) {
    	this.tag = tag;
    }
});