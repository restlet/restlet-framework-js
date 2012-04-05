var DimensionWriter = new [class Class]([class HeaderWriter], {
    appendCollection: function(dimensions) {
        if ((dimensions != null) && !dimensions.isEmpty()) {
            if (dimensions.contains([class Dimension].CLIENT_ADDRESS)
                    || dimensions.contains([class Dimension].TIME)
                    || dimensions.contains([class Dimension].UNSPECIFIED)) {
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
        if (dimension == [class Dimension].CHARACTER_SET) {
            this.append([class HeaderConstants].HEADER_ACCEPT_CHARSET);
        } else if (dimension == [class Dimension].CLIENT_AGENT) {
        	this.append([class HeaderConstants].HEADER_USER_AGENT);
        } else if (dimension == [class Dimension].ENCODING) {
        	this.append([class HeaderConstants].HEADER_ACCEPT_ENCODING);
        } else if (dimension == [class Dimension].LANGUAGE) {
        	this.append([class HeaderConstants].HEADER_ACCEPT_LANGUAGE);
        } else if (dimension == [class Dimension].MEDIA_TYPE) {
        	this.append([class HeaderConstants].HEADER_ACCEPT);
        } else if (dimension == [class Dimension].AUTHORIZATION) {
        	this.append([class HeaderConstants].HEADER_AUTHORIZATION);
        }

        return this;
    }
});

DimensionWriter.extend({
	write: function(dimensions) {
		return new DimensionWriter().appendCollection(dimensions).toString();
	}
});
