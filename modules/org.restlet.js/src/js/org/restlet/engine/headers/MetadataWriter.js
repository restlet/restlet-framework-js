var MetadataWriter = new Class(HeaderWriter, {
    appendObject: function(metadata) {
        return this.append(metadata.getName());
    }
});