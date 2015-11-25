/**
 * Some Helper Functions to format dates.
 */
var DateFormatHelper = {
		
	/**
	 * Formats the Time part of a Date Object to the formats
	 * 
	 * HH:mm
	 * HH:mm:ss
	 * HH:mm:ss.SSS
	 * 
	 * addSeconds and addMilliseconds controls the precision of the formatting.
	 * 
	 */
	timeToString: function(date, addSeconds, addMilliseconds) {
		var timeString = "";
		
		timeString += (date.getHours() < 10 ? "0" : "") + date.getHours() + ":";
		timeString += (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
		
		if (addSeconds) {
			timeString += ":" + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
			
			if (addMilliseconds) {
				timeString += ".";
				if (date.getMilliseconds() < 10) {
					timeString += "00";
				} else if (date.getMilliseconds() < 100) {
					timeString += "0";
				}
				timeString += date.getMilliseconds();
			}
		}
		
		return timeString;
	},
	
	/**
	 * Formats the date part of a Date Object to the format: dd/MM/yyyy
	 */
	dateToString: function (date) {
		var stringDate = "";
		
		stringDate += (date.getDate() < 10 ? "0" : "") + date.getDate() + "/";
		stringDate += (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "/";
		stringDate += date.getFullYear();
		
		return stringDate;
	},
	
	/**
	 * Formats the Date and the Time part of a Date Object to the formats:
	 * 
	 * HH:mm
	 * HH:mm:ss
	 * HH:mm:ss.SSS
	 * 
	 * addSeconds and addMilliseconds controls the precision of the formatting.
	 */
	dateTimeToString: function (date, addSeconds, addMilliseconds) {
		return this.dateToString(date) + " " +
			this.timeToString(date, addSeconds, addMilliseconds);
	},
	
	/**
	 * Formats the Date and the Time part of a Date Object to the format: HH:mm:ss.SSS.
	 */
	fullDateTimeToString: function(date) {
		return this.dateTimeToString(date, false, false);
	},
	
	/**
	 * Parses a Date string of any of the formats:
	 * 
	 * HH:mm
	 * HH:mm:ss
	 * HH:mm:ss.SSS
	 * 
	 *  (in this case the date part is set to 01/01/1970)
	 * 
	 * into a Date Object
	 */
	stringToTime: function(timeString) {
		var parts = timeString.split(".");
		var firstParts = parts[0].split(":");
		
		var date = new Date();
		date.setFullYear(1970);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(new Number(firstParts[0]));
		date.setMinutes(new Number(firstParts[1]));
		//date.setSeconds((firstParts.length == 3) ? new Number(firstParts[2]) : 0);
		
		//date.setMilliseconds(parts.length == 2 ? new Number(parts[1]) : 0);
		
		return date;
	},
	
	/**
	 * Parses a Date string of the format:
	 * 
	 * dd/MM/yyyy (in this case the time part is set to 00:00:00.000)
	 * 
	 * into a Date object
	 */
	stringToDate: function(dateString) {
		var parts = dateString.split("/");
		
		var date = new Date();
		date.setFullYear(new Number(parts[2]));
		date.setMonth(new Number(parts[1]) - 1);
		date.setDate(new Number(parts[0]));
		date.setHours(0);
		date.setMinutes(0);
		//date.setSeconds(0);
		//date.setMilliseconds(0);
		
		return date;
	},
	
	/**
	 * Parses a Date string of any of the formats:
	 * 
	 * dd/MM/yyyy (in this case the time part is set to 00:00:00.000)
	 * HH:mm (in this case the date part is set to 01/01/1970)
	 * HH:mm:ss (in this case the date part is set to 01/01/1970)
	 * HH:mm:ss.SSS (in this case the date part is set to 01/01/1970)
	 * dd/MM/yyyy HH:mm
	 * dd/MM/yyyy HH:mm:ss
	 * dd/MM/yyyy HH:mm:ss.SSS
	 * 
	 * into a Date Object.
	 */
	stringToDateTime: function (dateTimeString) {
		var parts = dateTimeString.split(" ");
		var date = new Date();
		
		if (parts[0].indexOf("/") != - 1) {
			var auxDate = this.stringToDate(parts[0]);
			date.setFullYear(auxDate.getFullYear());
			date.setMonth(auxDate.getMonth());
			date.setDate(auxDate.getDate());
		} else {
			date.setFullYear(1970);
			date.setMonth(0);
			date.setDate(1);
		}
		
		var timePartString;
		if (parts.length == 2) {
			timePartString = parts[1];
		} else if (parts[0].indexOf(":") != -1) {
			timePartString = parts[0];
		} else {
			date.setHours(0);
			date.setMinutes(0);
		//	date.setSeconds(0);
		//	date.setMilliseconds(0);
		}
		if (timePartString) {
			var auxDate = this.stringToTime(timePartString);
			date.setHours(auxDate.getHours());
			date.setMinutes(auxDate.getMinutes());
		//	date.setSeconds(auxDate.getSeconds());
		//	date.setMilliseconds(auxDate.getMilliseconds());
		}
		
		return date;
	}
};