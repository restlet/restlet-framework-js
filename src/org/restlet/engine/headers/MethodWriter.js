var MethodWriter = new [class Class](HeaderWriter, {
	initialize: function() {
		this.callSuperCstr();
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

