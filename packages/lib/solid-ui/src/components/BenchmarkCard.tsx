/**
 * BenchmarkCard — ops/sec result with baseline comparison and winner bar.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface BenchmarkResult {
	name: string;
	/** Operations per second. */
	opsPerSec: number;
	/** Margin text, e.g. "±0.5%". */
	margin?: string;
	/** Highlight as fastest. */
	winner?: boolean;
}

export interface BenchmarkCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	results: BenchmarkResult[];
	title?: string;
	/** Auto-mark the fastest result. @default true */
	autoWinner?: boolean;
	/** Bar scaled to max result. @default true */
	showBars?: boolean;
	/** Suffix after the number. @default "ops/s" */
	unit?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function BenchmarkCard(props: BenchmarkCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"results",
		"title",
		"autoWinner",
		"showBars",
		"unit",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const max = () => Math.max(...(local.results ?? []).map((r) => r.opsPerSec), 1);
	const isWinner = (r: BenchmarkResult) => r.winner ?? ((local.autoWinner ?? true) && r.opsPerSec === max());
	const fmt = (n: number) =>
		n >= 1_000_000
			? `${(n / 1_000_000).toFixed(1)}M`
			: n >= 1_000
				? `${(n / 1_000).toFixed(1)}k`
				: String(Math.round(n));

	return (
		<div
			class={`solidui-benchmark-card ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title}>
				<div class={`mb-3 font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
					{local.title}
				</div>
			</Show>
			<ul class="space-y-2">
				<For each={local.results}>
					{(r) => (
						<li>
							<div class="flex items-baseline justify-between gap-2">
								<span
									class={`truncate ${textSize[local.size ?? "md"]} ${isWinner(r) ? "font-semibold text-foreground" : "text-muted-foreground"}`}
								>
									{r.name}
									<Show when={isWinner(r)}>
										<span class="ml-1 text-2xs text-success">fastest</span>
									</Show>
								</span>
								<span
									class={`font-mono font-medium tabular-nums ${textSize[local.size ?? "md"]} ${isWinner(r) ? "text-foreground" : "text-muted-foreground"}`}
								>
									{fmt(r.opsPerSec)} {local.unit ?? "ops/s"}
									<Show when={r.margin}>
										<span class="ml-1 text-2xs text-muted-foreground/70">{r.margin}</span>
									</Show>
								</span>
							</div>
							<Show when={local.showBars ?? true}>
								<div class="mt-1 h-1 overflow-hidden rounded-full bg-muted">
									<div
										class={`h-full rounded-full transition-[width] motion-reduce:transition-none ${isWinner(r) ? "bg-success" : "bg-muted-foreground/40"}`}
										style={{ width: `${(r.opsPerSec / max()) * 100}%` }}
									/>
								</div>
							</Show>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
