var DateFormat = new Class({
	initialize: function(formatPattern) {
		this.formatPattern = formatPattern;
	},
	_isPattern: function(character) {
		for(var cpt=0;cpt<DateFormat.PATTERN_CHARACTERS.length;cpt++) {
			if (character==DateFormat.PATTERN_CHARACTERS[cpt]) {
				return true;
			}
		}
		return false;
	},
	_getTokens: function(s) {
		var tokens = [];
		var currentToken = "";
		var previousCharacter = "";
		var quoteOpened = false;
		var pattern = false;
		for (var cpt=0;cpt<s.length;cpt++) {
			var c = s[cpt];
			if (quoteOpened) {
				currentToken += c;
				if (s[cpt]=="'") {
					tokens.push(currentToken);
					quoteOpened = false;
					currentToken = "";
				}
				previousCharacter = c;
				continue;
			}
			if (this._isPattern(s[cpt])) {
				pattern = true;
				if (previousCharacter==c) {
					currentToken += c;
				} else {
					if (currentToken!="") {
						tokens.push(currentToken);
					}
					currentToken = c;
				}
			} else if (c=="'") {
				quoteOpened = true;
				if (currentToken!="") {
					tokens.push(currentToken);
				}
				currentToken = c;
			} else {
				if (pattern) {
					tokens.push(currentToken);
					currentToken = s[cpt];
					pattern = false;
				} else {
					currentToken += s[cpt];
				}
			}
			previousCharacter = c;
		}
		if (currentToken!="") {
			tokens.push(currentToken);
		}
		return tokens;
	},
	_getDateTokens: function(tokens, s) {
		var currentIndex = 0;
		var dateTokens = [];
		for (var cpt=0;cpt<tokens.length; cpt++) {
			var token = tokens[cpt];
			dateTokens.push(s.substr(currentIndex, token.length));
			currentIndex += token.length;
		}
		return dateTokens;
	},
	_getShortDayInWeekIndex: function(shortDay) {
		for (var cpt=0;cpt<DateFormat.SHORT_DAYS_IN_WEEK.length;cpt++) {
			if (DateFormat.SHORT_DAYS_IN_WEEK[cpt]==shortDay) {
				return cpt;
			}
		}
		return -1;
	},
	_getDayInWeekIndex: function(day) {
		for (var cpt=0;cpt<DateFormat.DAYS_IN_WEEK.length;cpt++) {
			if (DateFormat.DAYS_IN_WEEK[cpt]==day) {
				return cpt;
			}
		}
		return -1;
	},
	_getShortMonthIndex: function(shortMonth) {
		for (var cpt=0;cpt<DateFormat.SHORT_MONTHS.length;cpt++) {
			if (DateFormat.SHORT_MONTHS[cpt]==shortMonth) {
				return cpt;
			}
		}
		return -1;
	},
	_getMonthIndex: function(month, shortNames) {
		console.log("> _getMonthIndex");
		var monthNames = shortNames ? DateFormat.SHORT_MONTHS : DateFormat.MONTHS;
		for (var cpt=0;cpt<monthNames.length;cpt++) {
			console.log(" - monthNames[cpt] = "+monthNames[cpt]+", month = "+month);
			if (monthNames[cpt]==month) {
				return cpt;
			}
		}
		return -1;
	},
	_checkTokens: function(tokens, dateTokens) {
		if (tokens.length!=dateTokens.length) {
			throw new Error("Date doesn't match to pattern.");
		}
		for (var cpt=0;cpt<tokens.length;cpt++) {
			var token = tokens[cpt];
			var dateToken = dateTokens[cpt];
			if (token=="MM" || token=="dd" || token=="yyyy"
					|| token=="yy" || token=="HH"
					|| token=="mm" || token=="ss") {
				var error = false;
				try {
					var tmp = parseInt(dateToken);
					if (!isNumber(tmp)) {
						error = true;
					}
				} catch(err) {
					error = true;
				}
				if (error) {
					throw new Error("Unable to parse the token '"
							+dateToken+"' (format '"+token+"') as integer.");
				}
			}
		}
	},
	parse: function(s) {
		console.log("s = "+s);
		var tokens = this._getTokens(this.formatPattern);
		console.log("tokens = "+tokens.join("|"));
		var dateTokens = this._getDateTokens(tokens, s);
		console.log("dateTokens = "+dateTokens.join("|"));
		this._checkTokens(tokens, dateTokens);
		var date = new Date();
		date.setTime(0);
		for (var cpt=0;cpt<tokens.length;cpt++) {
			var token = tokens[cpt];
			var dateToken = dateTokens[cpt];
			console.log("token = "+token+", dateToken = "+dateToken);
			if (token=="EEEE") {
				//Do nothing
			} else if(token=="EEE") {
				//Do nothing
			} else if(token=="MMMMM") {
				console.log(" -> dateToken = "+dateToken);
				console.log("this._getMonthIndex(dateToken, false) = "+this._getMonthIndex(dateToken, false));
				date.setMonth(this._getMonthIndex(dateToken, false));
			} else if(token=="MMM") {
				console.log(" -> dateToken = "+dateToken);
				console.log("this._getMonthIndex(dateToken, false) = "+this._getMonthIndex(dateToken, true));
				date.setMonth(this._getMonthIndex(dateToken, true));
			} else if(token=="MM") {
				date.setMonth(parseInt(dateToken)-1);
			} else if(token=="dd") {
				date.setDate(parseInt(dateToken));
			} else if(token=="yyyy") {
				date.setFullYear(parseInt(dateToken));
			} else if(token=="yy") {
				date.setYear(parseInt(dateToken));
			} else if(token=="HH") {
				date.setHours(parseInt(dateToken));
			} else if(token=="mm") {
				date.setMinutes(parseInt(dateToken));
			} else if(token=="ss") {
				date.setSeconds(parseInt(dateToken));
			} else if(token=="zzz") {
			} else if(token=="z") {
			} else if(token=="aaa") {
			} else if(token=="a") {
			}
		}
		return date;
	},
	format: function(date) {
		var formattedDate = "";
		console.log("this.formatPattern = "+this.formatPattern);
		var tokens = this._getTokens(this.formatPattern);
		for (var cpt=0;cpt<tokens.length;cpt++) {
			var token = tokens[cpt];
			if (token=="EEEE") {
				formattedDate += DateFormat.DAYS_IN_WEEK[date.getDay()];
			} else if(token=="EEE") {
				formattedDate += DateFormat.SHORT_DAYS_IN_WEEK[date.getDay()];
			} else if(token=="MMMMM") {
				formattedDate += DateFormat.MONTHS[date.getMonth()];
			} else if(token=="MMM") {
				formattedDate += DateFormat.SHORT_MONTHS[date.getMonth()];
			} else if(token=="MM") {
				if (date.getMonth()+1<10) {
					formattedDate += "0";
				}
				formattedDate += date.getMonth()+1;
			} else if(token=="dd") {
				if (date.getDate()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getDate();
			} else if(token=="yyyy") {
				formattedDate += date.getFullYear();
			} else if(token=="yy") {
				if (date.getYear()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getYear();
			} else if(token=="HH") {
				if (date.getHours()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getHours();
			} else if(token=="mm") {
				if (date.getMinutes()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getMinutes();
			} else if(token=="ss") {
				if (date.getSeconds()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getSeconds();
			} else if(token=="zzz") {
				// Pacific Daylight Time
				formattedDate += "GMT";
			} else if(token=="z") {
				// PDT
				formattedDate += "GMT";
			} else if(token=="Z") {
				//+ or - value. for example -0700
			} else if(token=="aaa") {
			} else if(token=="a") {
				
			} else {
				formattedDate += token;
			}
		}
		return formattedDate;
	}
});

DateFormat.extend({
	PATTERN_CHARACTERS: ["E","M","d","H","m","s","y","z","a"],
	DAYS_IN_WEEK: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
	SHORT_DAYS_IN_WEEK: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
	MONTHS: ["January","February","March","April","May","June","July","August","September","October","November","December"],
	SHORT_MONTHS: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
});
