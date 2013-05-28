var WarningReader = new [class Class](HeaderReader, {
    initialize: function(header) {
        this.callSuperCstr(header);
    },

    readValue: function() {
        var result = new Warning();

        var code = this.readToken();
        this.skipSpaces();
        var agent = this.readRawText();
        this.skipSpaces();
        var text = this.readQuotedString();
        // The date is not mandatory
        this.skipSpaces();
        var date = null;
        if (this.peek() != -1) {
            date = this.readQuotedString();
        }

        if ((code == null) || (agent == null) || (text == null)) {
            throw new Error("Warning header malformed.");
        }

        result.setStatus([class Status].valueOf(parseInt(code)));
        result.setAgent(agent);
        result.setText(text);
        if (date != null) {
            result.setDate([class DateUtils].parse(date));
        }

        return result;
    }
});

WarningReader.extend({
	addValues: function(header, collection) {
		new WarningReader(header.getValue()).addValues(collection);
	}
});
