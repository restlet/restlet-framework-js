var LanguageWriter = new Class(MetadataWriter, {
    initialize: function(header) {
        this.callSuper(header);
    }
});

LanguageWriter.extend({
	write: function(languages) {
        return new LanguageWriter().appendCollection(languages).toString();
    }
});