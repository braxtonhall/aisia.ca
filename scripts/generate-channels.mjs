import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const CHANNELS = [
	{
		id: 2,
		code: "LAT",
		title: "Latest",
		randomise: false,
		videos: [
			{
				src: "mp4/juandefuca2025.mp4",
				description: "juandefuca2025",
				credits: "the whistle song - frankie knuckles",
			},
		],
	},
	{
		id: 3,
		code: "CMP",
		title: "Camping",
		randomise: true,
		videos: [
			{
				src: "mp4/camping/L1070726.mp4",
				description: "L1070726",
				credits: "passage xxii - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070727.mp4",
				description: "L1070727",
				credits: "passage xxiv - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070746.mp4",
				description: "L1070746",
				credits: "passage xxiii - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070747.mp4",
				description: "L1070747",
				credits: "passage xxvi - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070750.mp4",
				description: "L1070750",
				credits: "passage xxv - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070755.mp4",
				description: "L1070755",
				credits: "passage xxvii - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070759.mp4",
				description: "L1070759",
				credits: "passage xxviii - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070760.mp4",
				description: "L1070760",
				credits: "passage xxix - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070765.mp4",
				description: "L1070765",
				credits: "passage xxx - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070764.mp4",
				description: "L1070764",
				credits: "passage xxxi - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070766.mp4",
				description: "L1070766",
				credits: "passage xxxii - modern silent cinema",
			},
			{
				src: "mp4/camping/L1070767.mp4",
				description: "L1070767",
				credits: "a sceptical day - dorian concept",
			},
			{
				src: "mp4/camping/L1070770.mp4",
				description: "L1070770",
				credits: "an arc of doves - harold budd & brian eno",
			},
			{
				src: "mp4/camping/L1070774.mp4",
				description: "L1070774",
				credits: "hop on down - arthur russell",
			},
			{
				src: "mp4/camping/L1070775.mp4",
				description: "L1070775",
				credits: "it tango - laurie anderson",
			},
			{
				src: "mp4/camping/L1070776.mp4",
				description: "L1070776",
				credits: "lovefool (tee's club radio mix) - the cardigans",
			},
			{
				src: "mp4/camping/L1070780.mp4",
				description: "L1070780",
				credits: "bonny - prefab sprout",
			},
			{
				src: "mp4/camping/L1070781.mp4",
				description: "L1070781",
				credits: "ooh it's kinda crazy - souldecision",
			},
			{
				src: "mp4/camping/L1070782.mp4",
				description: "L1070782",
				credits: "long time - intro - playboi carti",
			},
			{
				src: "mp4/camping/L1070783.mp4",
				description: "L1070783",
				credits: "只爱陌生人 - faye wong",
			},
			{
				src: "mp4/camping/L1070786.mp4",
				description: "L1070786",
				credits: "open - cities aviv",
			},
			{
				src: "mp4/camping/L1070790.mp4",
				description: "L1070790",
				credits: "ou-ou-ta - hailu mergia & the walias band",
			},
			{
				src: "mp4/camping/L1070793.mp4",
				description: "L1070793",
				credits: "sah - al massrieen",
			},
			{
				src: "mp4/camping/L1070794.mp4",
				description: "L1070794",
				credits: "sfire 1 - sfire",
			},
			{
				src: "mp4/camping/L1070795.mp4",
				description: "L1070795",
				credits: "flashback - kelis",
			},
			{
				src: "mp4/camping/L1070797.mp4",
				description: "L1070797",
				credits: "for corners - digable planets",
			},
			{
				src: "mp4/camping/L1070798.mp4",
				description: "L1070798",
				credits: "only love can break your heart - saint etienne",
			},
			{
				src: "mp4/camping/L1070799.mp4",
				description: "L1070799",
				credits: "your love - frankie knuckles",
			},
			{
				src: "mp4/camping/L1070800.mp4",
				description: "L1070800",
				credits: "snowblind - tanya tagaq",
			},
		],
	},
	{
		id: 4,
		code: "BFR",
		title: "Before",
		randomise: false,
		videos: [
			{
				src: "mp4/lucycanontaro.mp4",
				description: "lucycanontaro - 2020",
				credits: "lucy - alex g",
			},
		],
	},
];

function probeMs(filePath) {
	if (!existsSync(filePath)) {
	
		return null;
	}
	const stdout = execFileSync("ffprobe", [
		"-v", "error",
		"-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1",
		filePath,
	], { encoding: "utf-8" });
	return Math.round(parseFloat(stdout.trim()) * 1000);
}

const result = CHANNELS.map((channel) => ({
	...channel,
	videos: channel.videos.map((video) => {
		const fullPath = join(ROOT, "static", video.src);
		const ms = probeMs(fullPath);
		if (ms !== null) {
			return { ...video, ms };
		}
		return null;
	}).filter(Boolean),
})).filter((c) => c.videos.length > 0);

const outPath = join(ROOT, "channels.json");
writeFileSync(outPath, JSON.stringify(result, null, "\t") + "\n");
