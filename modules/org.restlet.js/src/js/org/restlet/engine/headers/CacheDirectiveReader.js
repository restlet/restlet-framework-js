var CacheDirectiveReader = new [class Class]([class HeaderReader], {
    initialize: function(header) {
        this.callSuperCstr(header);
    },

    readValue: function() {
        return readNamedValue([class CacheDirective].class);
    }
});

CacheDirectiveReader.extend({
	addValues: function(header, collection) {
		new CacheDirectiveReader(header.getValue()).addValues(collection);
	}
});
