var DimensionReader = new [class Class]([class HeaderReader], {
    initialize: function(header) {
        this.callSuperCstr(header);
    },

    readValue: function() {
        var result = null;
        var value = this.readRawValue();

        if (value != null) {
            if (value.equalsIgnoreCase([class HeaderConstants].HEADER_ACCEPT)) {
                result = [class Dimension].MEDIA_TYPE;
            } else if (value
                    .equalsIgnoreCase([class HeaderConstants].HEADER_ACCEPT_CHARSET)) {
                result = [class Dimension].CHARACTER_SET;
            } else if (value
                    .equalsIgnoreCase([class HeaderConstants].HEADER_ACCEPT_ENCODING)) {
                result = [class Dimension].ENCODING;
            } else if (value
                    .equalsIgnoreCase([class HeaderConstants].HEADER_ACCEPT_LANGUAGE)) {
                result = [class Dimension].LANGUAGE;
            } else if (value
                    .equalsIgnoreCase([class HeaderConstants].HEADER_AUTHORIZATION)) {
                result = [class Dimension].AUTHORIZATION;
            } else if (value
                    .equalsIgnoreCase([class HeaderConstants].HEADER_USER_AGENT)) {
                result = [class Dimension].CLIENT_AGENT;
            } else if (value.equals("*")) {
                result = [class Dimension].UNSPECIFIED;
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

