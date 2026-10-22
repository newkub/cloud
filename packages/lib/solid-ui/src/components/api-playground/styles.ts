export const METHOD_COLOR: Record<string, string> = {
	GET: "text-info",
	POST: "text-success",
	PUT: "text-warning",
	PATCH: "text-warning",
	DELETE: "text-destructive",
};

export const inputClass =
	"flex-1 min-w-0 h-7 px-2 rounded border border-border bg-background text-xs font-mono text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring";
export const areaClass =
	"w-full px-2 py-1.5 rounded border border-border bg-background text-xs font-mono text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y";
export const labelClass = "text-2xs font-semibold uppercase tracking-wide text-muted-foreground m-0 mb-1.5";
export const fieldLabel = "text-xs font-mono text-foreground w-28 truncate shrink-0";
