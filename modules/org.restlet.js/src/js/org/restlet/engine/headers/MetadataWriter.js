var MetadataWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

	appendObject: function(metadata) {
        return this.append(metadata.getName());
    }
});