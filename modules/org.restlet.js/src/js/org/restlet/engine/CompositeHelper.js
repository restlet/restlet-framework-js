var CompositeHelper = new [class Class]([class RestletHelper], {
    initialize: function(helped) {
        this.callSuperCstr(helped);
        this.inboundNext = null;
        this.firstInboundFilter = null;
        this.firstOutboundFilter = null;
        this.lastInboundFilter = null;
        this.lastOutboundFilter = null;
        this.outboundNext = null;
    },

    addInboundFilter: function(filter) {
        var next = this.getInboundNext();

        if (this.getFirstInboundFilter() == null) {
            this.setFirstInboundFilter(filter);
        } else if (getLastInboundFilter() != null) {
        	this.getLastInboundFilter().setNext(filter);
        }

        this.setLastInboundFilter(filter);
        this.setInboundNext(next);
    },

    addOutboundFilter: function(filter) {
        var next = this.getOutboundNext();

        if (this.getFirstOutboundFilter() == null) {
        	this.setFirstOutboundFilter(filter);
        } else if (this.getLastOutboundFilter() != null) {
        	this.getLastOutboundFilter().setNext(filter);
        }

        this.setLastOutboundFilter(filter);
        this.setOutboundNext(next);
    },

    clear: function() {
    	this.setFirstInboundFilter(null);
    	this.setFirstOutboundFilter(null);
    	this.setInboundNext(null);
    	this.setLastInboundFilter(null);
    	this.setLastOutboundFilter(null);
    	this.setOutboundNext(null);
    },

    getFirstInboundFilter: function() {
        return this.firstInboundFilter;
    },

    getFirstOutboundFilter: function() {
        return this.firstOutboundFilter;
    },

    getInboundNext: function() {
        var result = null;

        if (this.getLastInboundFilter() != null) {
            result = this.getLastInboundFilter().getNext();
        } else {
            result = this.inboundNext;
        }

        return result;
    },

    getLastInboundFilter: function() {
        return this.lastInboundFilter;
    },

    getLastOutboundFilter: function() {
        return this.lastOutboundFilter;
    },

    getOutboundNext: function() {
        var result = null;

        if (this.getLastOutboundFilter() != null) {
            result = this.getLastOutboundFilter().getNext();
        } else {
            result = this.outboundNext;
        }

        return result;
    },

    handle: function(request, response) {
    	//response.setFirstOutboundFilter(this.getFirstOutboundFilter());
        this.callSuper("handle", request, response);

        if (this.getFirstInboundFilter() != null) {
        	this.getFirstInboundFilter().handle(request, response);
        } else {
            response.setStatus([class Status].SERVER_ERROR_INTERNAL);
            this.getHelped()
                    .getLogger()
                    .log([class Level].SEVERE,
                            "The "
                                    + getHelped()
                                    + " class has no Restlet defined to process calls. Maybe it wasn't properly started.");
        }
    },

    setFirstInboundFilter: function(firstInboundFilter) {
        this.firstInboundFilter = firstInboundFilter;
    },

    setFirstOutboundFilter: function(firstOutboundFilter) {
        this.firstOutboundFilter = firstOutboundFilter;
    },

    setInboundNext: function(next) {
        if (this.getLastInboundFilter() != null) {
        	this.getLastInboundFilter().setNext(next);
        }

        this.inboundNext = next;
    },

    setLastInboundFilter: function(last) {
        this.lastInboundFilter = last;
    },

    setLastOutboundFilter: function(last) {
        this.lastOutboundFilter = last;
    },

    setOutboundNext: function(next) {
        if (this.getLastOutboundFilter() != null) {
        	this.getLastOutboundFilter().setNext(next);
        }

        this.outboundNext = next;
    }
});