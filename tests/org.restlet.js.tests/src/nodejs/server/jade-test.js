var jade = require("jade");
var fs = require("fs");

var path = "./template.jade";
var options = {
	/*options.compileDebug = program.debug;
	options.client = program.client;
	options.pretty = program.pretty;
	options.watch = program.watch;*/
};

fs.readFile(path, 'utf8', function(err, str) {
	if (err) throw err;
	options.filename = path;
	var fn = jade.compile(str, options);
	var output = fn({title:"My title"});
	console.log(output);
});

var str = fs.readFileSync(path, 'utf8');
var fn = jade.compile(str, options);
var output = fn({title:"My title"});
console.log(output);