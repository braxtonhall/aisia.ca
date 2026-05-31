var Renderer = function(clock) {
	this.clock = clock;
	this._animations = [];
	this._effects = {
		instance: [],
		cycle: [],
		unit: []
	};
	this._lastEffects = {
		instance: -1,
		cycle: -1,
		unit: -1
	};
	this._loop();
};

Renderer.prototype.animate = function(props) {
	var self = this;
	var elements = [].concat(props.element);
	var options = props.options(self.clock.durations);
	elements.forEach(function(element) {
		var animation = element.animate(props.keyframes, options);
		self._animations.push({ animation: animation, timing: props.timing });
	});
};

Renderer.prototype.effect = function(props) {
	this._effects[props.when].push(props.effect);
};

Renderer.prototype._loop = function() {
	var self = this;
	var tick = function() {
		var instant = self.clock.now();

		['unit', 'cycle', 'instance'].forEach(function(when) {
			if (instant[when].index !== self._lastEffects[when]) {
				self._effects[when].forEach(function(effect) {
					effect(instant, self.clock.durations);
				});
				self._lastEffects[when] = instant[when].index;
			}
		});

		self._animations.forEach(function(anim) {
			anim.animation.currentTime = anim.timing(instant, self.clock.durations);
		});

		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
};
