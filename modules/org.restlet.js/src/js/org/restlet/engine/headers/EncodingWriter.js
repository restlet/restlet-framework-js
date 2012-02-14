var EncodingWriter = new Class(MetadataWriter, {
    initialize: function(header) {
        this.callSuper(header);
    },
    canAdd: function(value, values) {
        return value != null && !Encoding.IDENTITY.getName().equals(value.getName());
    },
    readValue: function() {
        return Encoding.valueOf(this.readToken());
    }
});

EncodingWriter.extend({
	write: function(encodings) {
        return new EncodingWriter().appendCollection(encodings).toString();
    }
});