var MethodWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(method) {
        this.appendToken(method.getName());
    }
});

MethodWriter.extend({
	write: function(methods) {
		return new MethodWriter().appendCollection(methods).toString();
	}
});

