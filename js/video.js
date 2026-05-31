const overlay = document.getElementById("video-loading-static");
let playing = null;
let endedListener = null;
let failsafeTimeout = null;
let guideLoadingTimeout = null;

player.loop = false;
let pendingTargetAt = -1;

const hideLoading = () => {
	if (pendingTargetAt < 0) return;
	if (player.currentTime < pendingTargetAt - 0.5) return;
	pendingTargetAt = -1;
	overlay.classList.remove("loading");
	videoChangeStatic.out({ seconds: 0.2 });
};

player.addEventListener("seeked", hideLoading);
player.addEventListener("playing", hideLoading);

const setEnded = () => {
	if (endedListener) {
		player.removeEventListener("ended", endedListener);
	}
	endedListener = playNext;
	player.addEventListener("ended", playNext, { once: true });
};

const loadVideo = (video, at) => {
	pendingTargetAt = at / 1000;
	overlay.classList.add("loading");
	videoChangeStatic.in({ seconds: 0.01 });
	player.src = video.src;
	player.currentTime = at / 1000;
	infoDescription = video.description;
	infoCredits = video.credits;
	drawInfo();

	clearTimeout(failsafeTimeout);
	failsafeTimeout = setTimeout(playNext, video.ms - at + 200);
};

const playNext = () => {
	clearTimeout(failsafeTimeout);
	if (!playing) return;
	const next = channelNextVideo(
		getCurrentChannel(),
		playing.index,
		playing.iteration,
	);
	playing = next;
	loadVideo(next.video, 0);
	setEnded();
};

const tuneChannel = (channel, announce = false) => {
	clearTimeout(failsafeTimeout);
	clearTimeout(guideLoadingTimeout);
	overlay.classList.add("loading");
	if (channel.isGuide) {
		playing = null;
		player.pause();
		player.removeAttribute('src');
		player.style.display = 'none';
		if (endedListener) {
			player.removeEventListener('ended', endedListener);
			endedListener = null;
		}
		channelChangeStatic.in({ seconds: 0.1 });
		guideLoadingTimeout = setTimeout(() => {
			overlay.classList.remove("loading");
			channelChangeStatic.out({ seconds: 0.2 });
			guideControl.in({ seconds: 0.2 });
		}, 200);
		var guide = document.getElementById('guide');
		if (guide) guide.style.display = '';
		if (!window._guideInitialized) {
			window._guideInitialized = initGuide();
		}
		infoDescription = "TV Guide";
		infoCredits = "-";
		drawInfo();
		if (announce) showChannelOsd(channel);
		return;
	} else {
		guideControl.out({ seconds: 0.2 });
	}

	var guide = document.getElementById('guide');
	if (guide) guide.style.display = 'none';
	player.style.display = '';

	channelChangeStatic.in({ seconds: 0.1 });
	setTimeout(() => {
		const now = getTime();
		playing = channelVideosAt(channel, now);
		channelChangeStatic.out({ seconds: 0.2 });
		loadVideo(playing.video, playing.at);
		setEnded();
		if (announce) showChannelOsd(channel);
	}, 100);
};

// Start with LAT channel dropped into the middle of the broadcast
tuneChannel(getCurrentChannel());
