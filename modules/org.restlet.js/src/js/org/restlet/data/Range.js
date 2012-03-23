Range = new Class({
	initialize: function(index, size) {
		if (index==null) {
			this.index = Range.INDEX_FIRST;
		} else {
			this.index = index;
		}
		
		if (size==null) {
			this.size = Range.SIZE_MAX;
		} else {
			this.size = size;
		}
	},

    equals: function(object) {
        return (object instanceof Range)
                && object.getIndex() == this.getIndex()
                && object.getSize() == this.getSize();
    },

    getIndex: function() {
        return this.index;
    },

    getSize: function() {
        return this.size;
    },

    isIncluded: function(position, totalSize) {
        var result = false;

        if (this.getIndex() == Range.INDEX_LAST) {
            // The range starts from the end
            result = (0 <= position) && (position < totalSize);

            if (result) {
                result = position >= (totalSize - this.getSize());
            }
        } else {
            // The range starts from the beginning
            result = position >= this.getIndex();

            if (result && (this.getSize() != SIZE_MAX)) {
                result = position < this.getIndex() + this.getSize();
            }
        }

        return result;
    },

    setIndex: function(index) {
        this.index = index;
    },

    setSize: function(size) {
        this.size = size;
    }
});

Range.extend({
	INDEX_FIRST: 0,
    INDEX_LAST: -1,
	SIZE_MAX: -1
});