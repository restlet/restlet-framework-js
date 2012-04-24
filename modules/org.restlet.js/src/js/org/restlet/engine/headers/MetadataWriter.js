var MetadataWriter = new [class Class](HeaderWriter, {
	initialize: function() {
    	this.content = [];
	},

	appendObject: function(metadata) {
        return this.append(metadata.getName());
    }
});