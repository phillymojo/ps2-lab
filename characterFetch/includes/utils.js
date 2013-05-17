UTILS = {
	convertMilliToTime: function(ms, asString) {
		var timeObj = {};
		var x = Math.floor(ms / 1000);
		timeObj.seconds = x % 60;
		x = Math.floor(x / 60);
		timeObj.minutes = x % 60;
		x = Math.floor(x / 60);
		timeObj.hours = x;
		
		if (timeObj.hours > 300) {
			timeObj.days = Math.floor(x / 24);
			timeObj.hours = x % 24;
		}
		if (asString) {
			return this.timeObjToString(timeObj);
		} else {
			return timeObj;
		}
	},
	
	timeObjToString: function(timeObj) {
		if (timeObj.hasOwnProperty('days')) {
			var timeString = timeObj.days + "d " + timeObj.hours + "h";
		} else {
			var timeString = timeObj.hours + "h " + timeObj.minutes + "m";
		}
		return timeString;
	},

	timestampToDate: function(ts, withTime) {
		var mydate = new Date(ts * 1000);
		var sec = mydate.getSeconds();
		var min = mydate.getMinutes();
		var hour = mydate.getHours();
		var hh = hour;
		var dd = 'AM';
		var day = mydate.getDate();
		var month = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
			][mydate.getMonth()];
		var year = mydate.getFullYear();
		min = min < 10 ? "0" + min : min;
		sec = sec < 10 ? "0" + sec : sec;
		hour = hour < 10 ? "0" + hour : hour;
		if (hour > 12) {
			hour = hh - 12;
			dd = 'PM';
		}
		if (hour == 12) {
			dd = 'PM';
		}
		if (withTime) {
			var result = month + ' ' + day + ' ' + year + ' ' + hour + ':' + min + ':' + sec + ' ' + dd;
		} else {
			var result = month + ' ' + day + ' ' + year;
		}
		return result;
	},
	
	// accepts minutes as integer and return string
	minutesToHours: function(min) {
		var h = Math.floor(min/60);
		var m = Math.floor(min - (h*60)) + 'm';
		return h + 'h ' + m;
	},
	
	// accepts integer and return string
	secondsToHours: function(sec) {
		var h = Math.floor(sec/3600);
		var m = (Math.floor((sec - (h*3600)) / 60)) + 'm';
		return h + 'h ' + m;
	}
}