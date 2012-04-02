var DimensionReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
    },

    readValue: function() {
        var result = null;
        var value = this.readRawValue();

        if (value != null) {
            if (value.equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT)) {
                result = Dimension.MEDIA_TYPE;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT_CHARSET)) {
                result = Dimension.CHARACTER_SET;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT_ENCODING)) {
                result = Dimension.ENCODING;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT_LANGUAGE)) {
                result = Dimension.LANGUAGE;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_AUTHORIZATION)) {
                result = Dimension.AUTHORIZATION;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_USER_AGENT)) {
                result = Dimension.CLIENT_AGENT;
            } else if (value.equals("*")) {
                result = Dimension.UNSPECIFIED;
            }
        }

        return result;
    }
});

DimensionReader.extend({
	addValues: function(header, collection) {
	    new DimensionReader(header.getValue()).addValues(collection);
	}
});

