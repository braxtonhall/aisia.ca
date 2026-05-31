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
			const js = readFileSync(join(ROOT, src), "utf-8");
			return `<script>\n${js}\n</script>`;
		},
	);

	await writeFile(join(DIST, "index.html"), html);

	// Copy static assets
	if (existsSync(STATIC)) {
		await copyDir(STATIC, DIST);
	}

	console.log("Build complete: dist/index.html");
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
