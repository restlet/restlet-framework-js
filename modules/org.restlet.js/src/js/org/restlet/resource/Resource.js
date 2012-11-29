var Resource = new [class Class]({
    doCatch: function(err) {
        this.getLogger().log([class Level].INFO, "Exception or error caught in resource",
                err);
    },

    /*protected void doError(Status errorStatus) {
    }

    protected final void doError(Status errorStatus, String errorMessage) {
        doError(new Status(errorStatus, errorMessage));
    }

    protected void doInit() throws ResourceException {
    }

    protected void doRelease() throws ResourceException {
    }*/

    getAllowedMethods: function() {
        return this.getResponse() == null ? null : this.getResponse().getAllowedMethods();
    },

    getApplication: function() {
        return this.application;
    },

    getChallengeRequests: function() {
        return this.getResponse() == null ? null : this.getResponse()
                .getChallengeRequests();
    },

    getChallengeResponse: function() {
        return this.getRequest() == null ? null : this.getRequest()
                .getChallengeResponse();
    },

    getClientInfo: function() {
        return this.getRequest() == null ? null : this.getRequest().getClientInfo();
    },

    getConditions: function() {
        return this.getRequest() == null ? null : this.getRequest().getConditions();
    },

    getContext: function() {
        return this.context;
    },

    getConnegService: function() {
        var result = null;

        result = this.getApplication().getConnegService();

        if (result == null) {
            result = new [class ConnegService]();
        }

        return result;
    },

    getConverterService: function() {
        var result = null;

        result = this.getApplication().getConverterService();

        if (result == null) {
            result = new [class ConverterService]();
        }

        return result;
    },

    getCookies: function() {
        return this.getRequest() == null ? null : this.getRequest().getCookies();
    },

    getCookieSettings: function() {
        return this.getResponse() == null ? null : this.getResponse().getCookieSettings();
    },

    getDimensions: function() {
        return this.getResponse() == null ? null : this.getResponse().getDimensions();
    },

    getHostRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getHostRef();
    },

    getLocationRef: function() {
        return this.getResponse() == null ? null : this.getResponse().getLocationRef();
    },

    /*public Logger getLogger() {
        return getContext() != null ? getContext().getLogger() : Context
                .getCurrentLogger();
    }*/

    getMatrix: function() {
        return this.getReference() == null ? null : this.getReference().getMatrixAsForm();
    },

    getMaxForwards: function() {
        return this.getRequest() == null ? null : this.getRequest().getMaxForwards();
    },

    getMetadataService: function() {
        var result = null;

        result = this.getApplication().getMetadataService();

        if (result == null) {
            result = new [class MetadataService]();
        }

        return result;
    },

    getMethod: function() {
        return this.getRequest() == null ? null : this.getRequest().getMethod();
    },

    getOriginalRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getOriginalRef();
    },

    getProtocol: function() {
        return this.getRequest() == null ? null : this.getRequest().getProtocol();
    },

    getQuery: function() {
        return this.getReference() == null ? null : this.getReference().getQueryAsForm();
    },

    getRanges: function() {
        return this.getRequest() == null ? null : this.getRequest().getRanges();
    },

    getReference: function() {
        return this.getRequest() == null ? null : this.getRequest().getResourceRef();
    },

    getReferrerRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getReferrerRef();
    },

    getRequest: function() {
        return this.request;
    },

    getRequestAttributes: function() {
        return this.getRequest() == null ? null : this.getRequest().getAttributes();
    },

    getRequestCacheDirectives: function() {
        return this.getRequest() == null ? null : this.getRequest().getCacheDirectives();
    },

    getRequestEntity: function() {
        return this.getRequest() == null ? null : this.getRequest().getEntity();
    },

    getResponse: function() {
        return this.response;
    },

    getResponseAttributes: function() {
        return this.getResponse() == null ? null : this.getResponse().getAttributes();
    },

    getResponseCacheDirectives: function() {
        return this.getResponse() == null ? null : this.getResponse()
                .getCacheDirectives();
    },

    getResponseEntity: function() {
        return this.getResponse() == null ? null : this.getResponse().getEntity();
    },

    getRootRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getRootRef();
    },

    getServerInfo: function() {
        return this.getResponse() == null ? null : this.getResponse().getServerInfo();
    },

    getStatus: function() {
        return this.getResponse() == null ? null : this.getResponse().getStatus();
    },

    getStatusService: function() {
        var result = null;

        result = this.getApplication().getStatusService();

        if (result == null) {
            result = new [class StatusService]();
        }

        return result;
    },

    //public abstract Representation handle();

    init: function(context, request, response) {
        this.context = context;
        this.request = request;
        this.response = response;

        try {
            this.doInit();
        } catch (err) {
            this.doCatch(err);
        }
    },

    isConfidential: function() {
        return this.getRequest() == null ? null : this.getRequest().isConfidential();
    },

    isLoggable: function() {
        return this.getRequest() == null ? null : this.getRequest().isLoggable();
    },

    /*public final void release() {
        try {
            doRelease();
        } catch (Throwable t) {
            doCatch(t);
        }
    }*/

    setApplication: function(application) {
        this.application = application;
    },

    setRequest: function(request) {
        this.request = request;
    },

    setResponse: function(response) {
        this.response = response;
    },

    toObject: function(source, target) {
        var result = null;

        if (source != null) {
            try {
                var cs = this.getConverterService();
                result = cs.toObject(source, target, this);
            } catch (err) {
                throw new Error(err.message);
            }
        }

        return result;
    },

    toRepresentation: function(source, target) {
        var result = null;

        if (source != null) {
        	if (source instanceof [class Representation]) {
                result = source;
        	} else {
        		var cs = this.getConverterService();
        		result = cs.toRepresentation(source, target, this);
        	}
        }

        return result;
    },

    toString: function() {
        return (this.getRequest() == null ? "" : this.getRequest().toString())
                + (this.getResponse() == null ? "" : " => "
                        + this.getResponse().toString());
    }
});
