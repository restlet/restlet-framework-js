var CacheDirectiveReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
    },

    readValue: function() {
        return readNamedValue(CacheDirective.class);
    }
});

CacheDirectiveReader.extend({
	addValues: function(header, collection) {
		new CacheDirectiveReader(header.getValue()).addValues(collection);
	}
});
