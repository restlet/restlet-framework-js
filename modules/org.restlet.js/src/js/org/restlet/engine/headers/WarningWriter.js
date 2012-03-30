var WarningWriter = new Class(HeaderWriter, {
    initialize: function() {
        this.callSuper();
    },

    appendObject: function(warning) {
        var agent = warning.getAgent();
        var text = warning.getText();

        if (warning.getStatus() == null) {
            throw new Error(
                    "Can't write warning. Invalid status code detected");
        }

        if ((agent == null) || (agent.length == 0)) {
            throw new Error(
                    "Can't write warning. Invalid agent detected");
        }

        if ((text == null) || (text.length == 0)) {
            throw new Error(
                    "Can't write warning. Invalid text detected");
        }

        this.append(Integer.toString(warning.getStatus().getCode()));
        this.append(" ");
        this.append(agent);
        this.append(" ");
        this.appendQuotedString(text);

        if (warning.getDate() != null) {
        	this.appendQuotedString(DateUtils.format(warning.getDate()));
        }

        return this;
    }
});

TagWriter.extend({
	write: function(warnings) {
		return new WarningWriter().appendCollection(warnings).toString();
	}
});

