var StringBuilder = require("./StringBuilder");

var sb = new StringBuilder();
sb.append("this is");
sb.append(" a test string");

//toString
console.log("sb = |"+sb.toString()+"|");

//substring
var s1 = sb.substring(5, 10);
//must be "is a "
console.log("s1 = |"+s1+"|");

//charat
var c = sb.charAt(5);
console.log("c = "+c);
console.log("test c = "+(c=='i'));

//delete
sb.delete(5, 10);
console.log("sb = |"+sb.toString()+"|");

