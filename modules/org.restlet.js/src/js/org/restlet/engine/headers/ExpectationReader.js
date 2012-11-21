var ExpectationReader = new [class Class]([class HeaderReader], {
    initialize: function(header) {
        this.callSuperCstr(header);
    },

    readValue: function() {
        var result = this.readNamedValue();

        while (this.skipParameterSeparator()) {
            result.getParameters().add(this.readParameter());
        }

        return result;
    }
});

ExpectationReader.extend({
	addValues: function(header, clientInfo) {
		if (header != null) {
			new ExpectationReader(header).addValues(clientInfo.getExpectations());
		}
	}
});
