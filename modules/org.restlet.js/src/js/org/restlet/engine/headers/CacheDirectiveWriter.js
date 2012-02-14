var CacheDirectiveWriter = new Class(HeaderWriter, {
	append: function(directive) {
        this.appendExtension(directive);
        return this;
    }
});

CacheDirectiveWriter.extend({
	write: function(directives) {
		return new CacheDirectiveWriter().append(directives).toString();
	}
});