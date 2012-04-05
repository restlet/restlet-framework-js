var Disposition = new [class Class]({
    initialize: function(type, parameters) {
        this.type = type;
        this.parameters = parameters;
    },

    addDate: function(name, value) {
        this.getParameters().add(name,
                DateUtils.format(value, DateUtils.FORMAT_RFC_822.get(0)));
    },

    getFilename: function() {
        return this.getParameters().getFirstValue(Disposition.NAME_FILENAME, true);
    },

    getParameters: function() {
        if (this.parameters == null) {
            this.parameters = new [class Series]();
        }

        return this.parameters;
    },

    getType: function() {
        return this.type;
    },

    setCreationDate: function(value) {
        this.setDate(Disposition.NAME_CREATION_DATE, value);
    },

    setDate: function(name, value) {
        this.getParameters().set(name,
                DateUtils.format(value, DateUtils.FORMAT_RFC_822.get(0)), true);
    },

    setFilename: function(fileName) {
        this.getParameters().set(Disposition.NAME_FILENAME, fileName, true);
    },

    setModificationDate: function(value) {
        this.setDate(Disposition.NAME_MODIFICATION_DATE, value);
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setReadDate: function(value) {
        this.setDate(Disposition.NAME_READ_DATE, value);
    },

    setSize: function(size) {
        this.getParameters().set(Disposition.NAME_SIZE, size.toString(), true);
    },

    setType: function(type) {
        this.type = type;
    }

});

Disposition.extend({
    NAME_CREATION_DATE: "creation-date",
    NAME_FILENAME: "filename",
    NAME_MODIFICATION_DATE: "modification-date",
    NAME_READ_DATE: "read-date",
    NAME_SIZE: "size",
    TYPE_ATTACHMENT: "attachment",
    TYPE_INLINE: "inline",
    TYPE_NONE: "none"
});