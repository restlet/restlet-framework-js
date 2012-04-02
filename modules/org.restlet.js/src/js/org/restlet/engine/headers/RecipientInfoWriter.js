var RecipientInfoWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(recipientInfo) {
        if (recipientInfo.getProtocol() != null) {
            this.appendToken(recipientInfo.getProtocol().getName());
            this.append('/');
            this.appendToken(recipientInfo.getProtocol().getVersion());
            this.appendSpace();

            if (recipientInfo.getName() != null) {
            	this.append(recipientInfo.getName());

                if (recipientInfo.getComment() != null) {
                	this.appendSpace();
                	this.appendComment(recipientInfo.getComment());
                }
            } else {
                throw new Error(
                        "The name (host or pseudonym) of a recipient can't be null");
            }
        } else {
            throw new Error(
                    "The protocol of a recipient can't be null");
        }

        return this;
    }
});

RecipientInfoWriter.extend({
    write: function(recipientsInfo) {
        return new RecipientInfoWriter().appendCollection(recipientsInfo).toString();
    }
});