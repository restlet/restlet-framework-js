var CacheDirectiveWriter = new [class Class]([class HeaderWriter], {
	initialize: function() {
		this.callSuperCstr();
	},

	appendObject: function(directive) {
        this.appendExtension(directive);
        return this;
    }
});

CacheDirectiveWriter.extend({
	write: function(directives) {
		return new CacheDirectiveWriter().appendCollection(directives).toString();
	}
});