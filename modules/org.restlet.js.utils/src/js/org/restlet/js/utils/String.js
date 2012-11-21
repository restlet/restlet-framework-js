String.prototype.equalsIgnoreCase = function(arg) {               
    return (new String(this.toLowerCase())
             ==(new String(arg)).toLowerCase());
};
String.prototype.equals = function(arg) {
	return (this.toString()==arg.toString());
};
String.prototype.startsWith = function(arg) {
	if (this.length>=arg.length) {
		for (var i = 0; i<arg.length; i++) {
			if (this.charAt(i)!=arg.charAt(i)) {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
};
String.prototype.toBoolean = function() {
	return (this=="true");
}