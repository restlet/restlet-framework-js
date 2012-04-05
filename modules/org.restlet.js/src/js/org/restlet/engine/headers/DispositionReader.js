var DispositionReader = new [class Class]([class HeaderReader], {
    initialize: function(header) {
        this.callSuper(header);
    },

	readValue: function() {
        var result = null;
        var type = this.readToken();

        if (type.length > 0) {
            result = new Disposition();
            result.setType(type);

            if (this.skipParameterSeparator()) {
                var param = this.readParameter();

                while (param != null) {
                    result.getParameters().add(param);

                    if (this.skipParameterSeparator()) {
                        param = this.readParameter();
                    } else {
                        param = null;
                    }
                }
            }
        }

        return result;
    }
});