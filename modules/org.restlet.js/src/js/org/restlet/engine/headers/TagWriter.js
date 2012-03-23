var TagWriter = new Class(HeaderWriter, {
    initialize: function(header) {
        this.callSuper(header);
    },

    appendObject: function(tag) {
        return this.append(tag.format());
    }
});

TagWriter.extend({
	write: function(param) {
		if (param instanceof Array) {
			return new TagWriter().appendCollection(param).toString();
		} else {
			for (var elt in new TagWriter()) {
				console.log("elt = "+elt);
			}
			return new TagWriter().appendObject(param).toString();
		}
	}
});