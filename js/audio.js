const player = document.getElementById("player");
const context = new AudioContext();
const master = new Master(context).off();

const videoControl = new Fade(context)
	.in({ seconds: 0 })
	.addOutput(master)
	.addInput(new Media(context, player));

const guideControl = new Fade(context)
	.out({ seconds: 0 })
	.addInput(
		new Clamp(context, 0.01).addInput(new Oscillator(context, "sawtooth", 60*8)),
		new Clamp(context, 0.03).addInput(new Oscillator(context, "sawtooth", 60)),
		new Clamp(context, 0.02).addInput(new Noise(context, "pink")),
	)
	.addOutput(videoControl);

const videoChangeStatic = new Fade(context)
	.out({ seconds: 0 })
	.addInput(new Noise(context, "pink"))
	.addOutput(new Clamp(context, 0.5).addOutput(videoControl));

const channelChangeStatic = new Fade(context)
	.out({ seconds: 0 })
	.addInput(new Noise(context, "pink"))
	.addOutput(new Clamp(context, 0.5).addOutput(master));

const previewStatic = new Fade(context)
	.out({ seconds: 0 })
	.addInput(
		new Clamp(context, 0.05).addInput(new Oscillator(context, "sawtooth", 60)),
		new Clamp(context, 0.03).addInput(new Noise(context, "pink")),
	)
	.addOutput(master);
