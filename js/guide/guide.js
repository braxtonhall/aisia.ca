var _channels = [];

var initGuide = function() {
	var durations = {
		instance: INSTANCE_DURATION,
		cycle: CYCLE_DURATION,
		unit: TV_UNIT
	};

	var clock = new GuideClock(durations, NEXT_UNIT_DELTA_PCT * TV_UNIT);
	var renderer = new Renderer(clock);

	var makeOptions = function(d) {
		return {
			duration: d.instance,
			easing: 'steps(' + FPS * Math.round(d.instance / 1000) + ')'
		};
	};

	var enteringDiv = document.querySelector('.guide-instance.off-to-on');
	var exitingDiv = document.querySelector('.guide-instance.on-to-off');
	var timeEntering = document.querySelector('.guide-time-codes.off-to-on');
	var timeExiting = document.querySelector('.guide-time-codes.on-to-off');

	if (!enteringDiv || !exitingDiv || !timeEntering || !timeExiting) return { clock: clock, renderer: renderer };

	renderer.animate({
		element: timeEntering,
		keyframes: ENTERING_KEY_FRAMES,
		options: makeOptions,
		timing: function(time, d) { return (time.cycle.at + d.instance * (0.25/2)) % d.cycle; }
	});

	renderer.animate({
		element: timeExiting,
		keyframes: EXITING_KEY_FRAMES,
		options: makeOptions,
		timing: function(time, d) { return (time.cycle.at + d.instance * (0.25/2)) % d.cycle; }
	});

	renderer.effect({
		when: 'cycle',
		effect: function(time, d) {
			_channels = scheduler(time, d);
			drawUpcoming(
				document.getElementById('guide-upcoming'),
				time.now - time.unit.at,
				time.cycle.index,
				d,
				CHANNELS
			);
		}
	});

	renderer.effect({
		when: 'instance',
		effect: function(time, d) {
			var tvUnitStartTime = time.now - time.unit.at;
			drawTimeCodes(tvUnitStartTime, d);
			var past = time.instance.index * ON_SCREEN_COUNT;
			drawInstance(exitingDiv, ON_SCREEN_COUNT, ROW_COUNT, past - ON_SCREEN_COUNT, _channels);
			drawInstance(enteringDiv, ON_SCREEN_COUNT, ROW_COUNT, past, _channels);
		}
	});

	updateClock();
	setInterval(updateClock, 1000);

	renderer.animate({
		element: enteringDiv,
		keyframes: ENTERING_KEY_FRAMES,
		options: makeOptions,
		timing: function(time) { return time.instance.at; }
	});

	renderer.animate({
		element: exitingDiv,
		keyframes: EXITING_KEY_FRAMES,
		options: makeOptions,
		timing: function(time) { return time.instance.at; }
	});

	// --- Bob's Club panel ---
	var bobsClubPane = document.getElementById('bobs-club-pane');
	var bobsClubHeader = document.querySelector('.bobs-club-header');
	var bobsClubDateEls = document.querySelectorAll('.bobs-club-date');

	if (bobsClubPane && bobsClubHeader) {
		renderer.animate({
			element: bobsClubPane,
			keyframes: ENTERING_KEY_FRAMES,
			options: makeOptions,
			timing: function(time, d) { return time.cycle.at - (d.cycle - d.instance); }
		});
		renderer.animate({
			element: bobsClubPane,
			keyframes: EXITING_KEY_FRAMES,
			options: makeOptions,
			timing: function(time) { return time.cycle.at; }
		});
		renderer.animate({
			element: bobsClubHeader,
			keyframes: ENTERING_KEY_FRAMES,
			options: makeOptions,
			timing: function(time, d) { return time.cycle.at - (d.cycle - d.instance); }
		});
		renderer.animate({
			element: bobsClubHeader,
			keyframes: EXITING_KEY_FRAMES,
			options: makeOptions,
			timing: (time, durations) =>
				time.cycle.at - (durations.cycle - 2 * durations.instance) + durations.instance * (0.25),
		});

		renderer.animate({
			element: [bobsClubPane, bobsClubHeader],
			keyframes: [{ opacity: "0" }, { opacity: "0" }],
			options: (durations) => ({
				// * 2 because there are 2 instances where the panel is on the screen
				duration: durations.cycle - durations.instance * 2,
			}),
			timing: (time, durations) => time.cycle.at - durations.instance,
		});

		var dateStr = new Date().toLocaleDateString('en', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		Array.from(bobsClubDateEls).forEach(function(el) { el.innerText = dateStr; });
	}

	return { clock: clock, renderer: renderer };
};
