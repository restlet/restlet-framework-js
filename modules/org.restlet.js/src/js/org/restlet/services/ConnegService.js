var ConnegService = new [class Class](Service, {
    initialize: function(enabled) {
    	if (enabled==null) {
    		enabled = true;
    	}
        this.callSuperCstr(enabled);
        this.strict = false;
    },

    getPreferredVariant: function(variants, request, metadataService) {
        var conneg = this.isStrict() ? new [class StrictConneg](request, metadataService)
                : new [class FlexibleConneg](request, metadataService);
        return conneg.getPreferredVariant(variants);
    }

    isStrict: function() {
        return strict;
    }

    setStrict: function(strict) {
        this.strict = strict;
    }
});