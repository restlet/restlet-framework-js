var MetadataExtension = new [class Class]({
    initialize: function(name, metadata) {
        this.name = name;
        this.metadata = metadata;
    },

    getCharacterSet: function() {
        return this.getMetadata();
    },

    getEncoding: function() {
        return this.getMetadata();
    },

    getLanguage: function() {
        return this.getMetadata();
    },

    getMediaType: function() {
        return this.getMetadata();
    },

    getMetadata: function() {
        return this.metadata;
    },

    getName: function() {
        return this.name;
    }
});