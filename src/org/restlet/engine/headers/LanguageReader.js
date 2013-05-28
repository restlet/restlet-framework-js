var LanguageReader = new [class Class](HeaderReader, {
    initialize: function(header) {
        this.callSuperCstr(header);
    },

    readValue: function() {
        return Language.valueOf(this.readRawValue());
    }
});