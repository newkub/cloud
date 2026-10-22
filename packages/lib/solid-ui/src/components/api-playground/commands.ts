import type { ApiSpec } from "../../lib/api-spec";

export function buildCurl(ep: ApiSpec, url: string, body: string): string {
	const lines = [`curl -X ${ep.method} '${url}'`];
	if (body.trim()) {
		lines.push(`  -H 'Content-Type: application/json'`, `  -d '${body}'`);
	}
	return lines.join(" \\\n");
}

export function buildCommand(ep: ApiSpec, argValues: Record<string, string>): string {
	if (!ep.cli) return `${ep.method} ${ep.path}`;
	const parts = [ep.cli.command];
	if (ep.cli.subcommand) parts.push(ep.cli.subcommand);
	for (const a of ep.cli.args ?? []) {
		const v = argValues[a.name] ?? "";
		if (v) parts.push(`--${a.name}`, v);
	}
	return parts.join(" ");
}
