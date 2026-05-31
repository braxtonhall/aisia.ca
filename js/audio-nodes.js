/**
 * @abstract
 */
class Node {
	/**
	 * @abstract
	 * @type AudioNode
	 */
	node;

	/**
	 * @type AudioContext
	 */
	context;

	/**
	 * @param context {AudioContext}
	 */
	constructor(context) {
		this.context = context;
	}

	/**
	 * @param others {Node}
	 * @return {this}
	 */
	addOutput(...others) {
		others.forEach((node) => this.connect(node));
		return this;
	}

	/**
	 * @param others {Node}
	 * @return {this}
	 */
	addInput(...others) {
		others.forEach((node) => node.connect(this));
		return this;
	}

	/**
	 * @param other {Node}
	 * @return {this}
	 */
	connect(other) {
		this.node.connect(other.node);
		return this;
	}
}

class Fade extends Node {
	/**
	 * @type GainNode
	 */
	node;

	/**
	 * @param context {AudioContext}
	 */
	constructor(context) {
		super(context);
		this.node = this.context.createGain();
		this.node.gain.value = 0;
	}

	static calculateRemainingTime({ gain, duration, target }) {
		return Math.abs(gain - target) * duration;
	}

	in({ seconds }) {
		return this.fade({ seconds, target: 1 });
	}

	out({ seconds }) {
		return this.fade({ seconds, target: 0 });
	}

	fade({ target, seconds }) {
		const from = this.node.gain.value;
		const duration = Fade.calculateRemainingTime({
			gain: from,
			duration: seconds,
			target,
		});
		this.node.gain.cancelScheduledValues(this.context.currentTime);
		this.node.gain.setValueAtTime(from, this.context.currentTime);
		this.node.gain.linearRampToValueAtTime(
			target,
			this.context.currentTime + duration,
		);
		return this;
	}
}

class Oscillator extends Node {
	/**
	 * @type OscillatorNode
	 */
	node;

	/**
	 *
	 * @param context {AudioContext}
	 * @param type {OscillatorType}
	 * @param frequency {number}
	 */
	constructor(context, type, frequency) {
		super(context);
		this.node = this.context.createOscillator();
		this.node.type = type;
		this.node.frequency.value = frequency;
		this.node.start();
	}
}

class Master extends Node {
	/**
	 * @type GainNode
	 */
	node;

	/**
	 *
	 * @param context {AudioContext}
	 */
	constructor(context) {
		super(context);
		this.node = this.context.createGain();
		this.node.gain.value = 0;
		this.node.connect(this.context.destination);
	}

	on() {
		this.node.gain.setValueAtTime(1, this.context.currentTime);
		this.context.resume();
		return this;
	}

	off() {
		this.node.gain.setValueAtTime(0, this.context.currentTime);
		return this;
	}
}

class Noise extends Node {
	/**
	 * @type {Promise<void> | undefined}
	 */
	static ready;

	/**
	 *
	 * @param context {AudioContext}
	 * @return {Promise<void>}
	 */
	static getReady(context) {
		if (!Noise.ready) {
			Noise.ready = context.audioWorklet.addModule(
				"data:text/javascript," +
					encodeURI(document.getElementById("noise-generators").innerHTML),
			);
		}
		return Noise.ready;
	}

	/**
	 * @type AudioWorkletNode
	 */
	node;

	/**
	 * @type Promise<void>
	 */
	ready;

	/**
	 *
	 * @param context {AudioContext}
	 * @param type {"pink" | "white"}
	 */
	constructor(context, type) {
		super(context);
		this.ready = Noise.getReady(context).then(() => {
			this.node = new AudioWorkletNode(this.context, `${type}-noise`);
		});
	}

	connect(other) {
		this.ready.then(() => super.connect(other));
		return this;
	}
}

class Media extends Node {
	/**
	 * @type MediaElementAudioSourceNode
	 */
	node;

	/**
	 *
	 * @param context {AudioContext}
	 * @param media {HTMLMediaElement}
	 */
	constructor(context, media) {
		super(context);
		this.node = this.context.createMediaElementSource(media);
	}
}

class Clamp extends Node {
	/**
	 * @type GainNode
	 */
	node;

	/**
	 *
	 * @param context {AudioContext}
	 * @param value {number}
	 */
	constructor(context, value) {
		super(context);
		this.node = this.context.createGain();
		this.node.gain.value = value;
	}
}
