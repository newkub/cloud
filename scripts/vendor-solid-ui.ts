import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Manifest = {
	package: string;
	upstream: { repo: string; subdir: string; ref: string; localPath: string; refNote?: string };
	managed: string[];
	exclude: string[];
	localOwned: string[];
};

const ROOT = join(import.meta.dirname, "..");
const VENDORED = join(ROOT, "packages", "lib", "solid-ui");
const manifest: Manifest = JSON.parse(readFileSync(join(VENDORED, "VENDORED.json"), "utf8"));
const strict = process.argv.includes("--strict");
const git = (...args: string[]) =>
	execFileSync("git", ["-C", manifest.upstream.localPath, ...args], { encoding: "utf8" });

const globToRegExp = (glob: string) =>
	new RegExp(
		"^" +
			glob
				.replace(/[.+^${}()|[\]\\]/g, "\\$&")
				.replace(/\*\*\//g, "\u0001")
				.replace(/\*\*/g, "\u0002")
				.replace(/\*/g, "[^/]*")
				.replace(/\u0001/g, "(?:.*/)?")
				.replace(/\u0002/g, ".*") +
			"$",
	);

const excludeGlobs = manifest.exclude.map(globToRegExp);
const localOwned = new Set(manifest.localOwned);
const inScope = (rel: string) =>
	manifest.managed.some((entry) => rel === entry || rel.startsWith(`${entry}/`)) &&
	!excludeGlobs.some((re) => re.test(rel));

const blobHash = (content: Buffer) =>
	createHash("sha1")
		.update(Buffer.concat([Buffer.from(`blob ${content.length}\0`), content]))
		.digest("hex");

git("cat-file", "-e", `${manifest.upstream.ref}^{commit}`);

const prefix = `${manifest.upstream.subdir}/`;
const atPin = new Map<string, string>();
for (const line of git("ls-tree", "-r", manifest.upstream.ref, "--", prefix).split("\n")) {
	if (!line) continue;
	const [meta, path] = line.split("\t");
	const rel = path.slice(prefix.length);
	if (inScope(rel)) atPin.set(rel, meta.split(" ")[2]);
}

const pinned: string[] = [];
const patched: string[] = [];
const diverged: string[] = [];
const orphaned: string[] = [];

for (const [rel, sha] of atPin) {
	const file = join(VENDORED, rel);
	const exists = (() => {
		try {
			readFileSync(file);
			return true;
		} catch {
			return false;
		}
	})();
	if (!exists) {
		diverged.push(rel);
		continue;
	}
	if (blobHash(readFileSync(file)) === sha) pinned.push(rel);
	else if (localOwned.has(rel)) patched.push(rel);
	else diverged.push(rel);
}

for (const rel of localOwned) {
	if (!atPin.has(rel) && inScope(rel)) orphaned.push(rel);
}

const parsePaths = (output: string) =>
	output
		.split("\n")
		.filter(Boolean)
		.map((line) => line.replace(/^.{1,3}\s+/, "").split(" -> ").pop() ?? "")
		.map((path) => (path.startsWith(prefix) ? path.slice(prefix.length) : path))
		.filter(inScope);

const committed = parsePaths(git("diff", "--name-only", `${manifest.upstream.ref}..HEAD`, "--", prefix)).sort();
const uncommitted = parsePaths(git("status", "--porcelain", "--", prefix)).sort();

const list = (items: string[], cap = 20) => {
	for (const item of items.slice(0, cap)) console.log(`  - ${item}`);
	if (items.length > cap) console.log(`  ... ${items.length - cap} more`);
};

console.log(`vendor:      ${manifest.package} @ ${manifest.upstream.ref.slice(0, 12)}`);
console.log(`files @ pin: ${atPin.size} in scope`);
console.log(`copied:      ${pinned.length} pinned, ${patched.length} declared patch(es)`);
if (patched.length) list(patched);
if (diverged.length) {
	console.log(`diverged:    ${diverged.length} undeclared difference(s) from pin`);
	list(diverged);
}
if (orphaned.length) {
	console.log(`orphaned:    ${orphaned.length} declared patch(es) not in upstream`);
	list(orphaned);
}
console.log(`upstream committed after pin: ${committed.length} file(s) in scope`);
if (committed.length) list(committed);
console.log(`upstream uncommitted:         ${uncommitted.length} file(s)`);
if (uncommitted.length) list(uncommitted);

if (strict && diverged.length > 0) {
	console.error(`\nvendor check failed: ${diverged.length} file(s) differ from ${manifest.upstream.ref.slice(0, 12)}`);
	process.exit(1);
}
