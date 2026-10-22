/**
 * DistributionBar — single stacked percentage bar with optional legend.
 */
import { createSignal, For, type JSX, onMount, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

/** Segment color keys map to theme-token fills — never raw hex. */
export type DistributionBarColor = "primary" | "success" | "warning" | "destructive" | "info" | "muted";

export interface DistributionBarSegment {
	/** Segment label used in the legend and aria-label */
	label: string;
	/** Segment value — sized relative to the total */
	value: number;
	/** Segment color key @default auto-assigned by index */
	color?: DistributionBarColor;
}

export interface DistributionBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Segments to display, in order */
	segments?: DistributionBarSegment[];
	/** Show a legend under the bar @default false */
	showLegend?: boolean;
	/** Show each segment's percentage in the legend @default false */
	showValues?: boolean;
	/** Bar height in px @default 8 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Animate segment widths on mount (respects reduced-motion) @default false */
	animate?: boolean;
}

const palette: Record<DistributionBarColor, string> = {
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
	info: "bg-info",
	muted: "bg-muted-foreground",
};
const cycle: DistributionBarColor[] = ["primary", "info", "success", "warning", "destructive", "muted"];

export function DistributionBar(props: DistributionBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"segments",
		"showLegend",
		"showValues",
		"height",
		"radius",
		"animate",
	]);
	const [ready, setReady] = createSignal(false);
	onMount(() => {
		if (local.animate) setReady(true);
	});
	const total = () => (local.segments ?? []).reduce((sum, s) => sum + Math.max(0, s.value), 0);
	const pct = (v: number) => (total() > 0 ? (Math.max(0, v) / total()) * 100 : 0);
	const colorOf = (s: DistributionBarSegment, i: number) => palette[s.color ?? cycle[i % cycle.length]];
	const ariaLabel = () =>
		(local.segments ?? []).map((s) => `${s.label} ${Math.round(pct(s.value))}%`).join(", ") || "empty";
	return (
		<div class={`solidui-distribution-bar ${local.class ?? ""}`.trim()} {...rest}>
			<div
				role="img"
				aria-label={`Distribution: ${ariaLabel()}`}
				class={`flex w-full overflow-hidden bg-muted ${radiusMap[local.radius ?? "full"]}`}
				style={{ height: `${local.height ?? 8}px` }}
			>
				<For each={local.segments ?? []}>
					{(s, i) => (
						<div
							class={`${colorOf(s, i())} ${local.animate ? "transition-[width] duration-700 motion-reduce:transition-none" : ""}`}
							style={{ width: `${local.animate && !ready() ? 0 : pct(s.value)}%` }}
							title={`${s.label}: ${Math.round(pct(s.value))}%`}
						/>
					)}
				</For>
			</div>
			<Show when={local.showLegend}>
				<ul class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
					<For each={local.segments ?? []}>
						{(s, i) => (
							<li class="inline-flex items-center gap-1.5">
								<span class={`h-2 w-2 rounded-full ${colorOf(s, i())}`} aria-hidden="true" />
								<span>{s.label}</span>
								<Show when={local.showValues}>
									<span class="tabular-nums">{Math.round(pct(s.value))}%</span>
								</Show>
							</li>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
}
