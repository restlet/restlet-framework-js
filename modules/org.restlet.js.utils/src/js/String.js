String.prototype.equalsIgnoreCase = function(arg) {               
    return (new String(this.toLowerCase())
             ==(new String(arg)).toLowerCase());
};
String.prototype.equals = function(arg) {
	return (this.toString()==arg.toString());
};