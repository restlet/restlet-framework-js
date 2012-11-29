var Logger = new [class Class]({
	initialize: function(loggerName) {
		this.loggerName = loggerName;
	},
	log: function(level, message, err) {
		//console.log("blah - err = "+err);
		console.log("["+level+"] "+message);
		if (err!=null) {
			console.log(err/*.stack*/);
		}
	},
	
	warning: function(message, err) {
		this.log([class Level].WARNING, message, err);
	},
	
	fine: function(message, err) {
		this.log([class Level].FINE, message, err);
	},

	info: function(message, err) {
		this.log([class Level].INFO, message, err);
	}
});
