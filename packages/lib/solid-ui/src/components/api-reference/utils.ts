import type { ApiSpec } from "../../lib/api-spec";

export const IN_BADGE: Record<string, string> = {
	path: "bg-primary/10 text-primary border-primary/30",
	query: "bg-info/10 text-info border-info/30",
	header: "bg-warning/10 text-warning border-warning/30",
	cookie: "bg-muted/60 text-muted-foreground border-border",
};

export function statusClass(code: string): string {
	const n = Number.parseInt(code, 10);
	if (n >= 200 && n < 300) return "bg-success/15 text-success border-success/30";
	if (n >= 300 && n < 400) return "bg-info/15 text-info border-info/30";
	if (n >= 400 && n < 500) return "bg-warning/15 text-warning border-warning/30";
	if (n >= 500) return "bg-destructive/15 text-destructive border-destructive/30";
	return "bg-surface text-muted-foreground border-border";
}

export function curlCommand(ep: ApiSpec, base?: string): string {
	const url = `${base ?? ep.server ?? "https://api.example.com"}${ep.path}`;
	const lines = [`curl -X ${ep.method} "${url}"`];
	for (const p of (ep.parameters ?? []).filter((x) => x.in === "header")) {
		lines.push(`  -H "${p.name}: <value>"`);
	}
	if (ep.requestBody?.example != null) {
		lines.push(`  -H "Content-Type: application/json"`);
		lines.push(`  -d '${JSON.stringify(ep.requestBody.example)}'`);
	}
	return lines.join(" \\\n");
}
