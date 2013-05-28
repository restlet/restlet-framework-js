var JadeRepresentation = new [class Class]([class Representation], { 
	initialize: function(templateName, content, mediaType) {
		var jade = require('jade');
		var path = require("path");
		var fs = require("fs");
		
		this.mediaType = mediaType;

		// Compile a function
		var str = fs.readFileSync(templateName, 'utf8');
		var options = {};
		this.fn = jade.compile(str, options);
		this.write(this.fn(content));
	}
});