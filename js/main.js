const crt = document.getElementById("crt");
const muteControl = document.getElementById("mute-control");
const previewLinks = document.getElementsByClassName("previewable-link");

let muted = true;
const toggleMute = () => {
	muted = !muted;
	storage.dataset.muted = muted;
	if (muted) {
		muteControl.title = "umute";
		master.off();
	} else {
		muteControl.title = "mute";
		master.on();
		player.muted = false;
	}
};
muteControl.addEventListener("click", toggleMute);
muteControl.title = "unmute";
muteControl.classList.add("clickable");

document.getElementById("remote-mute").addEventListener("click", toggleMute);

document.getElementById("ch-up").addEventListener("click", () => {
	const channel = navigateChannel(1);
	tuneChannel(channel, true);
});

document.getElementById("ch-down").addEventListener("click", () => {
	const channel = navigateChannel(-1);
	tuneChannel(channel, true);
});

document.getElementById("remote-info").addEventListener("click", () => {
	const infoOff = document.getElementById("info-off");
	const infoDescription = document.getElementById("info-description");
	const infoCredits = document.getElementById("info-credits");
	let next;
	if (infoOff.checked) {
		next = infoDescription;
	} else if (infoDescription.checked) {
		next = infoCredits;
	} else {
		next = infoOff;
	}
	next.checked = true;
	next.dispatchEvent(new Event("change"));
	drawInfo();
});

document.getElementById("remote-av").addEventListener("click", () => {
	crt.classList.toggle("filter-off");
	crt.classList.add("wipe");
	setTimeout(() => crt.classList.remove("wipe"), 128);
});

let clearStaticTimeout;
const changeChannel = (hovering) => () => {
	channelChangeStatic.in({ seconds: 0.1 });
	clearTimeout(clearStaticTimeout);
	clearStaticTimeout = setTimeout(
		() => channelChangeStatic.out({ seconds: 0.2 }),
		100,
	);
	if (hovering) {
		videoControl.out({ seconds: 0.1 });
		previewStatic.in({ seconds: 0.1 });
	} else {
		videoControl.in({ seconds: 0.2 });
		previewStatic.out({ seconds: 0.1 });
		player.play();
	}
};

for (const element of previewLinks) {
	element.addEventListener("mouseenter", changeChannel(true));
	element.addEventListener("mouseleave", changeChannel(false));
}

crt.addEventListener("click", () => player.play());

const selection = colours[Math.floor(Math.random() * colours.length)];
const body = document.getElementById("root");
body.style.backgroundColor = selection.background;
body.style.color = selection.font;
