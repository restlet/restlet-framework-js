var MediaType = new Class({
	initialize: function(type) {
		this.type = type;
    },
	getType: function() {
		return this.type;
	}
});

MediaType.extend({
	APPLICATION_JSON: new MediaType("application/json"),
	TEXT_JSON: new MediaType("text/json"),
	APPLICATION_XML: new MediaType("application/xml"),
	TEXT_XML: new MediaType("text/xml")
});