var drawUpcoming = function(container, tvUnitStartTime, cycle, durations, channels) {
	var seed = tvUnitStartTime + '-' + cycle;
	var random = seededRandom(seed);
	var realChannels = channels.filter(function(c) { return !c.isGuide; });
	if (!realChannels.length) return;

	var channelIndex = Math.floor(random() * realChannels.length);
	var channel = realChannels[channelIndex];
	var unitsAway = 2 + Math.floor(random() * 5);
	var futureTime = tvUnitStartTime + durations.unit * unitsAway;

	container.replaceChildren();
	var playing;
	try {
		playing = channelVideosAt(channel, futureTime);
	} catch (_e) {
		return;
	}

	var channelTitle = document.createElement('div');
	channelTitle.innerText = channel.title;
	container.appendChild(channelTitle);

	var header = document.createElement('header');
	container.appendChild(header);

	var titleDiv = document.createElement('div');
	titleDiv.classList.add('title');
	titleDiv.innerText = playing.video.description;
	header.appendChild(titleDiv);

	var description = document.createElement('div');
	description.classList.add('description');
	description.innerText = playing.video.credits;
	container.appendChild(description);

	var showing = document.createElement('div');
	var futureDate = new Date(futureTime);
	var hours = futureDate.getHours();
	var mins = String(futureDate.getMinutes()).padStart(2, '0');
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12;
	showing.innerText = 'Showing at ' + hours + ':' + mins + ' ' + ampm;
	container.appendChild(showing);

	var channelId = document.createElement('div');
	channelId.innerText = 'Channel ' + String(channel.id + 1).padStart(2, '0');
	container.appendChild(channelId);
};
