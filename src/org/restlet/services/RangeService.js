var RangeService = new [class Class](Service, {
    initialize: function(enabled) {
        super(enabled);
    },

    createInboundFilter: function(context) {
        return new [class RangeFilter](context);
    }
});