const seededRandom = (seed) => {
	let s = 0;
	for (let i = 0; i < seed.length; i++) {
		s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
	}
	return () => {
		s = (s * 1103515245 + 12345) | 0;
		return (s >>> 0) / 4294967296;
	};
};

const seededShuffle = (array, seed) => {
	const arr = [...array];
	const r = seededRandom(seed);
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(r() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

// __CHANNELS_START__
const CHANNELS = [
	{
		id: 99,
		code: "DEV",
		title: "Dev Fallback",
		randomise: false,
		videos: [
			{
				src: "mp4/juandefuca2025.mp4",
				description: "dev fallback — build missing",
				credits: "run `npm run build` to generate channels",
				ms: 180_000,
			},
		],
	},
];
// __CHANNELS_END__

let currentChannelIndex = 0;

const getCurrentChannel = () => CHANNELS[currentChannelIndex];

const navigateChannel = (delta) => {
	currentChannelIndex =
		(((currentChannelIndex + delta) % CHANNELS.length) + CHANNELS.length) %
		CHANNELS.length;
	return CHANNELS[currentChannelIndex];
};

const channelTotalMs = (channel) =>
	channel.videos.reduce((sum, v) => sum + v.ms, 0);

const channelVideosAt = (channel, time) => {
	const total = channelTotalMs(channel);
	const iteration = Math.floor(time / total);
	const offset = time % total;

	let videos;
	if (channel.randomise && channel.videos.length > 1) {
		videos = seededShuffle(channel.videos, `${channel.code}-${iteration}`);
	} else {
		videos = channel.videos;
	}

	let elapsed = 0;
	for (let i = 0; i < videos.length; i++) {
		const video = videos[i];
		if (elapsed <= offset && offset < elapsed + video.ms) {
			return {
				video,
				index: i,
				videos,
				iteration,
				at: offset - elapsed,
			};
		}
		elapsed += video.ms;
	}

	return { video: videos[0], index: 0, videos, iteration, at: 0 };
};

const channelNextVideo = (channel, fromIndex, iteration) => {
	let videos;
	if (channel.randomise && channel.videos.length > 1) {
		videos = seededShuffle(channel.videos, `${channel.code}-${iteration}`);
	} else {
		videos = channel.videos;
	}
	const nextIndex = (fromIndex + 1) % videos.length;
	const nextIteration = nextIndex === 0 ? iteration + 1 : iteration;
	return {
		video: videos[nextIndex],
		index: nextIndex,
		iteration: nextIteration,
	};
};
