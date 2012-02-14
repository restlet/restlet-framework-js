var TagWriter = new Class(HeaderWriter, {
    appendObject: function(tag) {
        return this.append(tag.format());
    }
});

TagWriter.extend({
	write: function(tags) {
	    return new TagWriter().appendCollection(tags).toString();
	}
});