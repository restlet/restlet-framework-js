var EncodingReader = new [class Class]([class HeaderReader], {
    initialize: function(header) {
        this.callSuper(header);
        /*this.header = header;
        this.index = ((header == null) || (header.length == 0)) ? -1 : 0;
        this.mark = this.index;*/
    },
    canAdd: function(value, values) {
        return value != null && ![class Encoding].IDENTITY.getName().equals(value.getName());
    },
    readValue: function() {
        return [class Encoding].valueOf(this.readToken());
    }
});