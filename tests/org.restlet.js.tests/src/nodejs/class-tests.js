var commons = require("restlet").commons;

var Clazz1 = new commons.Class({
	initialize: function() {
		console.log("1");
	}
});

var Clazz2 = new commons.Class(Clazz1, {
	initialize: function() {
		console.log("2");
		this.callSuper();
	}
});

var Clazz3 = new commons.Class(Clazz2, {
	initialize: function() {
		console.log("3");
		this.callSuper();
	}
});

var c = new Clazz3();