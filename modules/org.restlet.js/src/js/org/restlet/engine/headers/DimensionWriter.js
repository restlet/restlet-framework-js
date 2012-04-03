var DimensionWriter = new Class(HeaderWriter, {
    appendCollection: function(dimensions) {
        if ((dimensions != null) && !dimensions.isEmpty()) {
            if (dimensions.contains(Dimension.CLIENT_ADDRESS)
                    || dimensions.contains(Dimension.TIME)
                    || dimensions.contains(Dimension.UNSPECIFIED)) {
                // From an HTTP point of view the representations can
                // vary in unspecified ways
                this.append("*");
            } else {
                var first = true;

                for (var i=0; i<dimensions.length; i++) {
                	var dimension = dimensions[i];
                    if (first) {
                        first = false;
                    } else {
                    	this.append(", ");
                    }

                    this.appendObject(dimension);
                }
            }
        }

        return this;
    },

    appendObject: function(dimension) {
        if (dimension == Dimension.CHARACTER_SET) {
            this.append(HeaderConstants.HEADER_ACCEPT_CHARSET);
        } else if (dimension == Dimension.CLIENT_AGENT) {
        	this.append(HeaderConstants.HEADER_USER_AGENT);
        } else if (dimension == Dimension.ENCODING) {
        	this.append(HeaderConstants.HEADER_ACCEPT_ENCODING);
        } else if (dimension == Dimension.LANGUAGE) {
        	this.append(HeaderConstants.HEADER_ACCEPT_LANGUAGE);
        } else if (dimension == Dimension.MEDIA_TYPE) {
        	this.append(HeaderConstants.HEADER_ACCEPT);
        } else if (dimension == Dimension.AUTHORIZATION) {
        	this.append(HeaderConstants.HEADER_AUTHORIZATION);
        }

        return this;
    }
});

DimensionWriter.extend({
	write: function(dimensions) {
		return new DimensionWriter().appendCollection(dimensions).toString();
	}
});
