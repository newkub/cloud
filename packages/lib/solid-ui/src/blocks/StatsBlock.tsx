import { For, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { Card, CardContent, CardHeader } from "../components/Card";

export interface StatItem {
	label: string;
	value: string;
	delta?: string;
	/** Trend direction — drives the delta badge color. */
	trend?: "up" | "down" | "flat";
}

export interface StatsBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	stats: StatItem[];
}

/** Composed stats grid — KPI cards with optional delta badges. */
export function StatsBlock(props: StatsBlockProps) {
	const trendVariant = (t?: StatItem["trend"]) =>
		t === "up" ? "success" : t === "down" ? "destructive" : ("default" as const);
	return (
		<div class={props.class}>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<For each={props.stats}>
					{(s) => (
						<Card>
							<CardHeader class="pb-1">
								<span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</span>
							</CardHeader>
							<CardContent class="flex items-baseline justify-between gap-2">
								<span class="text-2xl font-bold">{s.value}</span>
								{s.delta && <Badge variant={trendVariant(s.trend)}>{s.delta}</Badge>}
							</CardContent>
						</Card>
					)}
				</For>
			</div>
		</div>
	);
}
