var Adapter = new [class Class]({
    initialize: function(context) {
        this.context = context;
    },

    getContext: function() {
        return this.context;
    },

    getLogger: function() {
        var result = (this.getContext() != null) ? this.getContext().getLogger()
                : null;
        return (result != null) ? result : [class Context].getCurrentLogger();
    }
});
