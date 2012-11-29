var Directory = new [class Class]([class Finder], {
    initialize: function() {
    	var context = arguments[0];
    	var rootLocalReference = null;
    	if (typeof arguments[1] == "string") {
    		rootLocalReference = new [class Reference](arguments[1]);
    	} else {
    		rootLocalReference = arguments[1];
    	}
        this.callSuperCstr(context);

        // First, let's normalize the root reference to prevent any issue with
        // relative paths inside the reference leading to listing issues.
        var rootIdentifier = rootLocalReference.getTargetRef()
                .getIdentifier();
        //System.out.println("new Directory - rootIdentifier = "+rootIdentifier);

        if (rootIdentifier.endsWith("/")) {
            this.rootRef = new [class Reference](rootIdentifier);
        } else {
            // We don't take the risk of exposing directory "file:///C:/AA"
            // if only "file:///C:/A" was intended
            this.rootRef = new [class Reference](rootIdentifier + "/");
        }

        this.comparator = new [class AlphaNumericComparator]();
        this.deeplyAccessible = true;
        this.indexName = "index";
        this.listingAllowed = false;
        this.modifiable = false;
        this.negotiatingContent = true;
        //setTargetClass(DirectoryServerResource.class);
    },

    getComparator: function() {
        return this.comparator;
    },

    getIndexName: function() {
        return this.indexName;
    },

    getIndexRepresentation: function(variant, indexContent) {
        var result = null;
        if (variant.getMediaType().equals([class MediaType].TEXT_HTML)) {
            result = indexContent.getWebRepresentation();
        } else if (variant.getMediaType().equals([class MediaType].TEXT_URI_LIST)) {
            result = indexContent.getTextRepresentation();
        }
        return result;
    },

    getIndexVariants: function(indexContent) {
        var result = [];
        result.push(new [class Variant]([class MediaType].TEXT_HTML));
        result.push(new Variant([class MediaType].TEXT_URI_LIST));
        return result;
    },

    getRootRef: function() {
        return this.rootRef;
    },

    handle: function(request, response) {
        request.getAttributes()["org.restlet.directory"] = this;
        this.callSuper("handle", request, response);
    },

    isDeeplyAccessible: function() {
        return this.deeplyAccessible;
    },

    isListingAllowed: function() {
        return this.listingAllowed;
    },

    isModifiable: function() {
        return this.modifiable;
    },

    isNegotiatingContent: function() {
        return this.negotiatingContent;
    },

    setAlphaComparator: function() {
        this.useAlphaComparator();
    },

    setAlphaNumComparator: function() {
        this.useAlphaNumComparator();
    },

    setComparator: function(comparator) {
        this.comparator = comparator;
    },

    setDeeplyAccessible: function(deeplyAccessible) {
        this.deeplyAccessible = deeplyAccessible;
    },

    setIndexName: function(indexName) {
        this.indexName = indexName;
    },

    setListingAllowed: function(listingAllowed) {
        this.listingAllowed = listingAllowed;
    },

    setModifiable: function(modifiable) {
        this.modifiable = modifiable;
    },

    setNegotiatingContent: function(negotiatingContent) {
        this.negotiatingContent = negotiatingContent;
    },

    setRootRef: function(rootRef) {
        this.rootRef = rootRef;
    },

    useAlphaComparator: function() {
        this.setComparator(new [class AlphabeticalComparator]());
    },

    useAlphaNumComparator: function() {
        this.setComparator(new [class AlphabeticalComparator]());
    }
});