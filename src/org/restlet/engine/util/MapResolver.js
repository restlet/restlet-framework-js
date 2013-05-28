var MapResolver = new [class Class]([class Resolver], {
	initialize: function(map) {
        this.map = map;
    },

    resolve: function(variableName) {
        return this.map.get(variableName);
    }
});