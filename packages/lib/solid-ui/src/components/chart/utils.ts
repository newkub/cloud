import type { ChartDataPoint, ChartVariant } from "./types";

export const variantMap: Record<ChartVariant, string> = {
	default: "bg-primary",
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
	info: "bg-info",
};

export const W = 420;
export const PAD = 24;

export const PALETTE = [
	"hsl(var(--color-primary))",
	"hsl(var(--color-accent))",
	"hsl(var(--color-success))",
	"hsl(var(--color-warning))",
	"hsl(var(--color-destructive))",
	"hsl(var(--color-info))",
	"hsl(var(--color-muted-foreground))",
];

export function colorOf(d: ChartDataPoint, i: number) {
	return d.color ? `hsl(${d.color})` : PALETTE[i % PALETTE.length];
}

/** Points scaled into the plot box. */
export function xy(data: ChartDataPoint[], h: number) {
	const max = Math.max(1, ...data.map((d) => d.value));
	const pw = W - PAD * 2;
	const ph = h - PAD * 2;
	const n = Math.max(1, data.length - 1);
	return data.map((d, i) => ({
		x: PAD + (i / n) * pw,
		y: PAD + ph - (d.value / max) * ph,
		d,
	}));
}
