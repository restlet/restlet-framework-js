var RecipientInfoReader = new [class Class](HeaderReader, {
    initialize: function(header) {
        this.callSuperCstr(header);
    },

    readValue: function() {
        var result = new [class RecipientInfo]();
        var protocolToken = this.readToken();

        if (this.peek() == '/') {
        	this.read();
            result.setProtocol(new [class Protocol](protocolToken, protocolToken, null,
                    -1, this.readToken()));
        } else {
            result.setProtocol(new [class Protocol]("HTTP", "HTTP", null, -1,
                    protocolToken));
        }

        // Move to the next text
        if (this.skipSpaces()) {
            result.setName(this.readRawText());

            // Move to the next text
            if (this.skipSpaces()) {
                result.setComment(this.readComment());
            }
        }

        return result;
    }
});

RecipientInfoReader.extend({
	addValues: function(header, collection) {
		new RecipientInfoReader(header.getValue()).addValues(collection);
	}
});