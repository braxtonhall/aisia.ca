const overlay = document.getElementById("video-loading-static");

for (let i = videos.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[videos[i], videos[j]] = [videos[j], videos[i]];
}

player.loop = false;
player.addEventListener("canplay", () => {
	overlay.classList.remove("loading");
	videoChangeStatic.out({ seconds: 0.2 });
});

let currentVideoIndex = 0;
const play = (index) => () => {
	currentVideoIndex =
		((index % videos.length) + videos.length) % videos.length;
	overlay.classList.add("loading");
	videoChangeStatic.in({ seconds: 0.01 });
	const video = videos[currentVideoIndex];
	player.src = video.src;
	infoDescription = video.description;
	infoCredits = video.credits;
	drawInfo();
	player.addEventListener("ended", play((index + 1) % videos.length), {
		once: true,
	});
};
play(0)();

const changeVideo = (delta) => {
	channelChangeStatic.in({ seconds: 0.1 });
	setTimeout(() => {
		channelChangeStatic.out({ seconds: 0.2 });
		play(currentVideoIndex + delta)();
	}, 100);
};
