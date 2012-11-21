var ChildContext = new [class Class]([class Context], {
    initialize: function(parentContext) {
        this.child = null;
        this.parentContext = parentContext;
        /*this.setClientDispatcher(new ChildClientDispatcher(this));
        this.setServerDispatcher((parentContext != null) ? this.getParentContext()
                .getServerDispatcher() : null);*/
    },

    getChild: function() {
        return this.child;
    },

    getParentContext: function() {
        return this.parentContext;
    },

    setChild: function(child) {
        this.child = child;
        /*setLogger(LogUtils.getLoggerName(this.parentContext.getLogger()
                .getName(), child));*/
    }
});