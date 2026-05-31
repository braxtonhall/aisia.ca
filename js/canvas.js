const storage = document.getElementById("storage");
const muteCanvas = document.getElementById("crt-mute-canvas");
const infoCanvas = document.getElementById("crt-info-canvas");
const cornerCanvas = document.getElementById("crt-corner-canvas");
const osdCanvas = document.getElementById("crt-osd-canvas");
const muteCtx = muteCanvas.getContext("2d");
const infoCtx = infoCanvas.getContext("2d");
const cornerCtx = cornerCanvas.getContext("2d");
const osdCtx = osdCanvas.getContext("2d");
let infoDescription = "";
let infoCredits = "";
const counterUrl =
	"https://bobs-server.net/counters/cm7n4e4cc0006ovm8ew2xe1w2/actions/cm7n4ecsm0007ovm8lrh91n0a";
const counterImage = new Image();
counterImage.src = counterUrl;

const setCanvasSizes = () => {
	const style = getComputedStyle(document.documentElement);
	const w = parseInt(style.getPropertyValue("--crt-width"));
	const h = parseInt(style.getPropertyValue("--crt-height"));
	muteCanvas.width = w;
	muteCanvas.height = h;
	infoCanvas.width = w;
	infoCanvas.height = h;
	cornerCanvas.width = w;
	cornerCanvas.height = h;
	osdCanvas.width = w;
	osdCanvas.height = h;
};

const crtBreakpoint = window.matchMedia(
	"(max-width: 540px), (max-height: 420px)",
);
crtBreakpoint.addEventListener("change", () => {
	setCanvasSizes();
	drawMute();
	drawInfo();
	drawCounter();
});

const textStyle = (ctx) => {
	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = "#25c320";
};

const drawMute = () => {
	const cw = muteCanvas.width;
	const ch = muteCanvas.height;
	const fontSize = Math.round((cw * 13) / 192);
	const pad = fontSize;
	muteCtx.clearRect(0, 0, cw, ch);
	if (storage.dataset.muted !== "true") return;
	textStyle(muteCtx);
	muteCtx.font = `900 ${fontSize}px monospace`;
	muteCtx.textBaseline = "top";
	muteCtx.fillText("MUTE", pad, pad);
};

const drawInfo = () => {
	const cw = infoCanvas.width;
	const ch = infoCanvas.height;
	const fontSize = Math.round((cw * 13) / 192);
	const lineHeight = Math.round((fontSize * 26) / 22);
	const pad = fontSize;
	infoCtx.clearRect(0, 0, cw, ch);
	const infoDescr = document.getElementById("info-description");
	const infoCreditsEl = document.getElementById("info-credits");
	let text = "";
	if (infoDescr && infoDescr.checked) text = infoDescription;
	else if (infoCreditsEl && infoCreditsEl.checked) text = infoCredits;
	if (!text) return;
	textStyle(infoCtx);
	infoCtx.font = `900 ${fontSize}px monospace`;
	infoCtx.textBaseline = "top";
	const words = text.toUpperCase().split(" ");
	const maxWidth = cw - pad * 2;
	const lines = [];
	let currentLine = "";
	for (const word of words) {
		const testLine = currentLine ? currentLine + " " + word : word;
		if (infoCtx.measureText(testLine).width <= maxWidth) {
			currentLine = testLine;
		} else {
			if (currentLine) lines.push(currentLine);
			currentLine = word;
		}
	}
	if (currentLine) lines.push(currentLine);
	const totalHeight = lines.length * lineHeight;
	const startY = ch - totalHeight - pad;
	for (let i = 0; i < lines.length; i++) {
		infoCtx.fillText(lines[i], pad, startY + i * lineHeight);
	}
};

const drawCounter = () => {
	const cw = cornerCanvas.width;
	const ratio = cw / 192;
	const margin = Math.round(11 * ratio);
	const imgHeight = margin;
	if (!counterImage.naturalWidth) return;
	const aspect = counterImage.naturalWidth / counterImage.naturalHeight;
	const imgWidth = Math.round(imgHeight * aspect);
	const x = cw - margin - imgWidth;
	const y = margin;
	cornerCtx.clearRect(0, 0, cw, cornerCanvas.height);
	cornerCtx.imageSmoothingEnabled = false;
	cornerCtx.drawImage(counterImage, x, y, imgWidth, imgHeight);
};

setCanvasSizes();
drawMute();
drawInfo();
counterImage.addEventListener("load", drawCounter);
if (counterImage.complete) drawCounter();

const muteObserver = new MutationObserver(() => drawMute());
muteObserver.observe(storage, {
	attributes: true,
	attributeFilter: ["data-muted"],
});

for (const id of ["info-off", "info-description", "info-credits"]) {
	const radio = document.getElementById(id);
	if (radio) radio.addEventListener("change", drawInfo);
}

const drawChannelOsd = (channel) => {
	const cw = osdCanvas.width;
	const ch = osdCanvas.height;
	osdCtx.clearRect(0, 0, cw, ch);
	if (!channel) return;
	const fontSize = Math.round((cw * 13) / 192);
	const lineHeight = Math.round((fontSize * 26) / 22);
	const pad = fontSize;
	textStyle(osdCtx);
	osdCtx.font = `900 ${fontSize}px monospace`;
	osdCtx.textBaseline = "top";
	osdCtx.textAlign = "right";
	const number = String(channel.id + 1).padStart(2, "0");
	osdCtx.fillText(number, cw - pad, pad);
	osdCtx.fillText(channel.code, cw - pad, pad + lineHeight);
};
