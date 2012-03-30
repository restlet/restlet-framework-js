var CacheDirectiveWriter = new Class(HeaderWriter, {
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