var LanguageReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
    },

    readValue: function() {
        return Language.valueOf(this.readRawValue());
    }
});