var PreferenceWriter = new [class Class](HeaderWriter, {
	initialize: function() {
		this.callSuperCstr();
	},

	appendObject: function(pref) {
        this.append(pref.getMetadata().getName());

        if (pref.getQuality() < 1) {
            this.append(";q=");
            this.appendQuality(pref.getQuality());
        }

        if (pref.getParameters() != null) {
            var param;

            var params = pref.getParameters();
            for (var i=0; i<params.length; i++) {
                param = params[i];

                if (param.getName() != null) {
                    this.append(';').append(param.getName());

                    if ((param.getValue() != null)
                            && (param.getValue().length() > 0)) {
                        this.append('=').append(param.getValue());
                    }
                }
            }
        }

        return this;
    },

    appendQuality: function(quality) {
        if (!HeaderUtils.isValidQuality(quality)) {
            throw new Error(
                    "Invalid quality value detected. Value must be between 0 and 1.");
        }

        // [ifndef gwt]
        //TODO: implement number format for JS
        /*java.text.NumberFormat formatter = java.text.NumberFormat
                .getNumberInstance(java.util.Locale.US);
        formatter.setMaximumFractionDigits(2);
        append(formatter.format(quality));*/
        // [enddef]

        return this;
    }
});

PreferenceWriter.extend({
    isValidQuality: function(quality) {
        return (quality >= 0) && (quality <= 1);
    },

    write: function(prefs) {
        return new PreferenceWriter().appendCollection(prefs).toString();
    }
});