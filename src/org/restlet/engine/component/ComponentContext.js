var ComponentContext = new [class Class]([class Context], {
    initialize: function(componentHelper) {
        /*super(LogUtils
                .getLoggerName("org.restlet", componentHelper.getHelped()));*/
        this.componentHelper = componentHelper;
        /*this.setClientDispatcher(new [class ComponentClientDispatcher](this));
        this.setServerDispatcher(new [class ComponentServerDispatcher](this));*/
    },

    createChildContext: function() {
        return new [class ChildContext](this.getComponentHelper().getHelped().getContext());
    },

    getComponentHelper: function() {
        return this.componentHelper;
    },

    setComponentHelper: function(componentHelper) {
        this.componentHelper = componentHelper;
    }
});