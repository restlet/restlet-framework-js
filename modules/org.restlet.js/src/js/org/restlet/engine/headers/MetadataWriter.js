var MetadataWriter = new [class Class](HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

	appendObject: function(metadata) {
        return this.append(metadata.getName());
    }
});