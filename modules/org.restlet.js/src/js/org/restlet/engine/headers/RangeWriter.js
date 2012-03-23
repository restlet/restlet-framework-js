var RangeWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendCollection: function(ranges) {
        if (ranges == null || ranges.isEmpty()) {
            return this;
        }

        this.append("bytes=");

        for (var i = 0; i < ranges.length; i++) {
            if (i > 0) {
            	this.append(", ");
            }

            this.appendObject(ranges.get(i));
        }

        return this;
    },

    appendObject: function(range) {
        if (range.getIndex() >= Range.INDEX_FIRST) {
            this.append(range.getIndex());
            append("-");

            if (range.getSize() != Range.SIZE_MAX) {
                append(range.getIndex() + range.getSize() - 1);
            }
        } else if (range.getIndex() == Range.INDEX_LAST) {
            append("-");

            if (range.getSize() != Range.SIZE_MAX) {
                append(range.getSize());
            }
        }

        return this;
    }
});

RangeWriter.extend({
    write: function(param, size) {
    	if (param instanceof Array) {
    		var ranges = param;
            return new RangeWriter().appendCollection(ranges).toString();
    	} else {
    		var range = param;
            var b = new StringBuilder("bytes ");

            if (range.getIndex() >= Range.INDEX_FIRST) {
                b.append(range.getIndex());
                b.append("-");
                if (range.getSize() != Range.SIZE_MAX) {
                    b.append(range.getIndex() + range.getSize() - 1);
                } else {
                    if (size != Representation.UNKNOWN_SIZE) {
                        b.append(size - 1);
                    } else {
                        throw new Error(
                                "The entity has an unknown size, can't determine the last byte position.");
                    }
                }
            } else if (range.getIndex() == Range.INDEX_LAST) {
                if (range.getSize() != Range.SIZE_MAX) {
                    if (size != Representation.UNKNOWN_SIZE) {
                        if (range.getSize() <= size) {
                            b.append(size - range.getSize());
                            b.append("-");
                            b.append(size - 1);
                        } else {
                            throw new Error(
                                    "The size of the range ("
                                            + range.getSize()
                                            + ") is higher than the size of the entity ("
                                            + size + ").");
                        }
                    } else {
                        throw new Error(
                                "The entity has an unknown size, can't determine the last byte position.");
                    }
                } else {
                    // This is not a valid range.
                    throw new Error(
                            "The range provides no index and no size, it is invalid.");
                }
            }

            if (size != Representation.UNKNOWN_SIZE) {
                b.append("/").append(size);
            } else {
                b.append("/*");
            }

            return b.toString();
    	}
    }
});