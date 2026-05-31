var GuideClock = function(durations, offset) {
	this.durations = durations;
	this.offset = offset;
};

GuideClock.prototype.calculate = function(time) {
	var now = time + this.offset;
	var unit = Math.floor(now / this.durations.unit);
	var unitAt = now % this.durations.unit;
	var cycle = Math.floor(unitAt / this.durations.cycle);
	var cycleAt = now % this.durations.cycle;
	var instance = Math.floor(cycleAt / this.durations.instance);
	var instanceAt = now % this.durations.instance;
	return {
		now: now,
		unit: { index: unit, at: unitAt, remaining: this.durations.unit - unitAt },
		cycle: { index: cycle, at: cycleAt, remaining: this.durations.cycle - cycleAt },
		instance: { index: instance, at: instanceAt, remaining: this.durations.instance - instanceAt }
	};
};

GuideClock.prototype.at = function(at) {
	return this.calculate(at);
};

GuideClock.prototype.now = function() {
	return this.calculate(getTime());
};
