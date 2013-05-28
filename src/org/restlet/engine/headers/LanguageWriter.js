var LanguageWriter = new [class Class](MetadataWriter, {
    initialize: function(header) {
        this.callSuperCstr(header);
    }
});

LanguageWriter.extend({
	write: function(languages) {
        return new LanguageWriter().appendCollection(languages).toString();
    }
});