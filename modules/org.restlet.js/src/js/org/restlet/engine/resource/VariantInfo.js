var VariantInfo = new [class Class]([class Variant], {
    initialize: function(mediaType, annotationInfo) {
    	var mediaType = arguments[0];
    	if (mediaType instanceof [class Variant]) {
    		mediaType = mediaType.getMediaType();
            this.setCharacterSet(variant.getCharacterSet());
            this.setEncodings(variant.getEncodings());
            this.setLanguages(variant.getLanguages());
    	}
        this.callSuperCstr(mediaType);

        this.annotationInfo = annotationInfo;
        this.inputScore = 1.0;
    },

    equals: function(other) {
        var result = this.callSuper("equals", other) && (other instanceof VariantInfo);

        if (result && (other != this)) {
            var otherVariant = other;

            // Compare the annotation info
            if (result) {
                result = ((this.getAnnotationInfo() == null)
                        && (otherVariant.getAnnotationInfo() == null) || (this.getAnnotationInfo() != null)
                        && this.getAnnotationInfo().equals(
                                otherVariant.getAnnotationInfo()));
            }
        }

        return result;
    },

    getAnnotationInfo: function() {
        return this.annotationInfo;
    },

    getInputScore: function() {
        return this.inputScore;
    },

    setInputScore: function(inputScore) {
        this.inputScore = inputScore;
    },
});