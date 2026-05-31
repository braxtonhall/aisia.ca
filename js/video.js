const overlay = document.getElementById("video-loading-static");
let playing = null;
let endedListener = null;
let failsafeTimeout = null;

player.loop = false;
player.addEventListener("canplay", () => {
	overlay.classList.remove("loading");
	videoChangeStatic.out({ seconds: 0.2 });
});

const setEnded = () => {
	if (endedListener) {
		player.removeEventListener("ended", endedListener);
	}
	endedListener = playNext;
	player.addEventListener("ended", playNext, { once: true });
};

const loadVideo = (video, at) => {
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
