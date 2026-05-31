var formatTime = function(ms) {
	var d = new Date(ms);
	var h = d.getHours();
	var m = String(d.getMinutes()).padStart(2, '0');
	var s = String(d.getSeconds()).padStart(2, '0');
	var ampm = h >= 12 ? 'PM' : 'AM';
	h = h % 12 || 12;
	return h + ':' + m + ':' + s + ' ' + ampm;
};

var drawTimeCodes = function(startTime, durations) {
	var nowStr = formatTime(startTime);
	var afterStr = formatTime(startTime + durations.unit);
	var laterStr = formatTime(startTime + durations.unit * 2);

	var headers = document.querySelectorAll('.guide-time-codes');
	for (var h = 0; h < headers.length; h++) {
		var header = headers[h];
		var nowEl = header.querySelector('.now');
		var afterEl = header.querySelector('.after');
		var laterEl = header.querySelector('.later');
		if (nowEl) nowEl.innerText = nowStr;
		if (afterEl) afterEl.innerText = afterStr;
		if (laterEl) laterEl.innerText = laterStr;
	}
};

var updateClock = function() {
	var clocks = document.querySelectorAll('.guide-clock');
	for (var i = 0; i < clocks.length; i++) {
		clocks[i].innerText = formatTime(getTime());
	}
};
