import { readFile, writeFile, copyFile, mkdir } from "node:fs/promises";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const ROOT = new URL(".", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const STATIC = join(ROOT, "static");

async function copyDir(src, dest) {
	await mkdir(dest, { recursive: true });
	for (const entry of readdirSync(src, { withFileTypes: true })) {
		const srcPath = join(src, entry.name);
		const destPath = join(dest, entry.name);
		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath);
		} else {
			await copyFile(srcPath, destPath);
		}
	}
}

async function build() {
	await mkdir(DIST, { recursive: true });

	const channelsPath = join(ROOT, "channels.json");
	let channels = null;
	if (existsSync(channelsPath)) {
		channels = JSON.parse(await readFile(channelsPath, "utf-8"));
	}

	let html = await readFile(join(ROOT, "index.html"), "utf-8");

	// Inline CSS
	html = html.replace(
		/<link\s+rel="stylesheet"\s+href="([^"]*)"\s*\/?\s*>/g,
		(match, href) => {
			const css = readFileSync(join(ROOT, href), "utf-8");
			return `<style>\n${css}\n</style>`;
		},
	);

	// Inline JS (skip worklet scripts with type="x-audioworklet/javascript")
	html = html.replace(
		/<script\s+src="([^"]*)"\s*>\s*<\/script>/g,
		(match, src) => {
			let js = readFileSync(join(ROOT, src), "utf-8");
			if (src === "js/channel.js" && channels) {
				js = js.replace(
					/\/\/ __CHANNELS_START__[\s\S]*\/\/ __CHANNELS_END__/,
					`// __CHANNELS_START__\nconst CHANNELS = ${JSON.stringify(channels)};\n// __CHANNELS_END__`,
				);
			}
			return `<script>\n${js}\n</script>`;
		},
	);

	await writeFile(join(DIST, "index.html"), html);

	// Copy static assets
	if (existsSync(STATIC)) {
		await copyDir(STATIC, DIST);
	}
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
