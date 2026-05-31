var getOverflow = function(difference, unit) {
	if (difference > unit) return 2;
	if (difference > 0) return 1;
	return 0;
};

var selectSchedule = function(env) {
	var start = env.start;
	var episodes = env.episodes;
	var columnDuration = env.columnDuration;
	var unitCount = env.unitCount;
	var unitDuration = env.unitDuration;

	var end = start + unitDuration * unitCount;
	var filled = 0;
	var output = [];

	for (var i = 0; i < episodes.length; i++) {
		var episode = episodes[i];
		if (episode.end <= start) continue;
		if (episode.start >= end) continue;

		var left = getOverflow(start - episode.start, columnDuration);
		var right = getOverflow(episode.end - end, columnDuration);
		var length = Math.min(end, episode.end) - Math.max(start, episode.start);
		var units = Math.min(Math.floor(length / unitDuration), unitCount);
		if (units <= 0) {
			if (length > 0 && filled < unitCount) {
				units = Math.min(1, unitCount - filled);
			} else {
				continue;
			}
		}
		filled += units;

		output.push({
			left: left,
			right: right,
			units: units,
			cc: false,
			series: episode.series,
			title: episode.title,
			start: episode.start,
			end: episode.end
		});

		if (filled >= unitCount) break;
	}

	return output;
};

var snapTime = function(time, unit) {
	return Math.round(time / unit) * unit;
};

var channelSchedule = function(channel, startTime, windowMs) {
	if (!channel.videos || !channel.videos.length) return [];

	var result = [];
	var videoAt = channelVideosAt(channel, startTime);

	var firstStart = snapTime(startTime - videoAt.at, PRECISION);
	var firstEnd = snapTime(firstStart + videoAt.video.ms, PRECISION);

	result.push({
		title: videoAt.video.description,
		start: firstStart,
		end: firstEnd,
		cc: false,
		series: videoAt.video.description
	});

	var currentTime = firstEnd;
	var currentIndex = videoAt.index;
	var currentIteration = videoAt.iteration;

	while (currentTime < startTime + windowMs) {
		var next = channelNextVideo(channel, currentIndex, currentIteration);
		var nextEnd = snapTime(currentTime + next.video.ms, PRECISION);
		result.push({
			title: next.video.description,
			start: currentTime,
			end: nextEnd,
			cc: false,
			series: next.video.description
		});
		currentTime = nextEnd;
		currentIndex = next.index;
		currentIteration = next.iteration;
	}

	return result;
};

var scheduler = function(instant, durations) {
	var start = instant.now - instant.unit.at;
	var unitCount = (COLUMNS * durations.unit) / PRECISION;

	return CHANNELS.map(function(channel) {
		var episodes = channelSchedule(channel, start, COLUMNS * durations.unit);
		var env = {
			episodes: episodes,
			columnDuration: durations.unit,
			unitCount: unitCount,
			start: start,
			unitDuration: PRECISION
		};
		var schedule = episodes.length
			? selectSchedule(env)
			: [{
				series: channel.title,
				title: channel.title,
				cc: false,
				units: env.unitCount,
				left: 0,
				right: 0,
				start: start,
				end: start + COLUMNS * durations.unit
			}];
		return { code: channel.code, displayNumber: channel.id + 1, schedule: schedule };
	});
};
