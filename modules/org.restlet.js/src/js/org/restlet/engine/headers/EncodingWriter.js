var EncodingWriter = new [class Class]([class MetadataWriter], {
    initialize: function(header) {
        this.callSuperCstr(header);
    },
    canAdd: function(value, values) {
        return value != null && ![class Encoding].IDENTITY.getName().equals(value.getName());
    },
    readValue: function() {
        return [class Encoding].valueOf(this.readToken());
    }
});

EncodingWriter.extend({
	write: function(encodings) {
        return new EncodingWriter().appendCollection(encodings).toString();
    }
});