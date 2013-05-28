var Conneg = new [class Class]({
    initialize: function(request, metadataService) {
        this.request = request;
    },

    getRequest: function() {
        return this.request;
    },

    getPreferredVariant: function(variants) {
        var result = null;

        if ((variants != null) && !variants.isEmpty()) {
            var bestScore = -1.0;
            var current;

            // Compute the score of each variant
            for (var i=0; i<variants.length; i++) {
            	var variant = variants[i];
                current = this.scoreVariant(variant);

                if (current > bestScore) {
                    bestScore = current;
                    result = variant;
                }
            }
        }

        return result;
    },

    scoreVariant: function(variant) {
    	return 0;
    }
});