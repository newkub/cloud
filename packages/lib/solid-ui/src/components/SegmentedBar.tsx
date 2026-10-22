/**
 * SegmentedBar — proportional segments in a single bar (language-bar style).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BarSegment {
	label: string;
	value: number;
	/** UnoCSS/Tailwind bg class, e.g. "bg-primary". Falls back to palette order. */
	color?: string;
}

export interface SegmentedBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	segments: BarSegment[];
	/** Bar height preset. */
	size?: "sm" | "md" | "lg";
	/** Show legend with labels + percentages. @default true */
	showLegend?: boolean;
	/** Show percentage values in the legend. @default true */
	showPercent?: boolean;
	/** Show labels on hover only (title attr) vs legend. */
	onSegmentClick?: (segment: BarSegment) => void;
	/** Corner radius on the bar. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default true */
	fullWidth?: boolean;
}

const palette = ["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-destructive", "bg-secondary"] as const;
const barH = { sm: "h-1.5", md: "h-2.5", lg: "h-4" } as const;

export function SegmentedBar(props: SegmentedBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"segments",
		"size",
		"showLegend",
		"showPercent",
		"onSegmentClick",
		"radius",
		"elevation",
		"fullWidth",
	]);

	const segs = () => local.segments ?? [];
	const total = () => segs().reduce((s, seg) => s + Math.max(0, seg.value), 0) || 1;
	const pct = (v: number) => (Math.max(0, v) / total()) * 100;
	const color = (s: BarSegment, i: number) => s.color ?? palette[i % palette.length];

	return (
		<div
			class={`solidui-segmented-bar ${(local.fullWidth ?? true) ? "w-full" : "inline-block min-w-40"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div
				role="img"
				aria-label={segs()
					.map((s) => `${s.label} ${pct(s.value).toFixed(1)}%`)
					.join(", ")}
				class={`flex w-full overflow-hidden ${barH[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${local.elevation ? elevationMap[local.elevation] : ""}`.trim()}
			>
				<For each={segs()}>
					{(s, i) => (
						// biome-ignore lint/a11y/noStaticElementInteractions: role/tabindex applied only when clickable
						<div
							role={local.onSegmentClick ? "button" : undefined}
							tabIndex={local.onSegmentClick ? 0 : undefined}
							class={`${color(s, i())} ${
								local.onSegmentClick
									? "cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
									: ""
							} transition-[width] motion-reduce:transition-none`}
							style={{ width: `${pct(s.value)}%` }}
							title={`${s.label}: ${pct(s.value).toFixed(1)}%`}
							onClick={() => local.onSegmentClick?.(s)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									local.onSegmentClick?.(s);
								}
							}}
						/>
					)}
				</For>
			</div>
			<Show when={local.showLegend ?? true}>
				<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1">
					<For each={segs()}>
						{(s, i) => (
							<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
								<span class={`h-2.5 w-2.5 rounded-full ${color(s, i())}`} />
								{s.label}
								<Show when={local.showPercent ?? true}>
									<span class="tabular-nums">{pct(s.value).toFixed(1)}%</span>
								</Show>
							</span>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
