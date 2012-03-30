var Resource = new Class({

    /*protected void doCatch(Throwable throwable) {
        getLogger().log(Level.INFO, "Exception or error caught in resource",
                throwable);
    }

    protected void doError(Status errorStatus) {
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
        var result = this.application;

        if (result == null) {
            result = Application.getCurrent();

            if (result == null) {
                result = new Application(this.getContext());
            }

            this.application = result;
        }

        return result;
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

    /*public org.restlet.service.ConnegService getConnegService() {
        org.restlet.service.ConnegService result = null;

        // [ifndef gwt] instruction
        result = getApplication().getConnegService();

        if (result == null) {
            result = new org.restlet.service.ConnegService();
        }

        return result;
    }*/

    /*public org.restlet.service.ConverterService getConverterService() {
        org.restlet.service.ConverterService result = null;

        // [ifndef gwt] instruction
        result = getApplication().getConverterService();

        if (result == null) {
            result = new org.restlet.service.ConverterService();
        }

        return result;
    }*/

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

    /*public MetadataService getMetadataService() {
        MetadataService result = null;

        // [ifndef gwt] instruction
        result = getApplication().getMetadataService();

        if (result == null) {
            result = new MetadataService();
        }

        return result;,
    }*/

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

    /*public StatusService getStatusService() {
        StatusService result = null;

        // [ifndef gwt] instruction
        result = getApplication().getStatusService();

        if (result == null) {
            result = new StatusService();
        }

        return result;
    }*/

    //public abstract Representation handle();

    /*public void init(Context context, Request request, Response response) {
        this.context = context;
        this.request = request;
        this.response = response;

        try {
            doInit();
        } catch (Throwable t) {
            doCatch(t);
        }
    }*/

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

    /*toObject: function(source, target)
            throws ResourceException {
        T result = null;

        if (source != null) {
            try {
                org.restlet.service.ConverterService cs = getConverterService();
                result = cs.toObject(source, target, this);
            } catch (Exception e) {
                throw new ResourceException(e);
            }
        }

        return result;
    }

    public Representation toRepresentation(Object source, Variant target) {
        Representation result = null;

        if (source != null) {
            // [ifndef gwt]
            org.restlet.service.ConverterService cs = getConverterService();
            result = cs.toRepresentation(source, target, this);
            // [enddef]
            // [ifdef gwt] uncomment
            // if (source instanceof Representation) {
            // result = (Representation) source;
            // }
            // [enddef]
        }

        return result;
    }*/

    toString: function() {
        return (this.getRequest() == null ? "" : this.getRequest().toString())
                + (this.getResponse() == null ? "" : " => "
                        + this.getResponse().toString());
    }
});
