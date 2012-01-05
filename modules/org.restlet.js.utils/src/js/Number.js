function isNumber(x) { 
	return ( (typeof x === typeof 1) && (null !== x) && isFinite(x) );
}
