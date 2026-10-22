/**
 * TraceWaterfall - nested horizontal span bars on a shared time scale (agent/tool tracing).
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface TraceSpan {
	/** Span label. */
	name: string;
	/** Start offset in ms from trace begin. */
	start: number;
	/** Span duration in ms. */
	duration: number;
	/** Nested child spans. */
	children?: TraceSpan[];
}

const SAMPLE_SPANS: TraceSpan[] = [
	{
		name: "agent.run",
		start: 0,
		duration: 940,
		children: [
			{ name: "llm.completion", start: 20, duration: 380 },
			{
				name: "tool.search",
				start: 410,
				duration: 300,
				children: [{ name: "http.request", start: 430, duration: 240 }],
			},
			{ name: "llm.summary", start: 720, duration: 200 },
		],
	},
];

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "p-3 text-2xs",
	md: "p-4 text-xs",
	lg: "p-6 text-sm",
};

/** Bar fill per nesting depth — semantic tokens only. */
const depthFill = ["bg-primary", "bg-info", "bg-success", "bg-warning"];

interface FlatSpan {
	span: TraceSpan;
	depth: number;
}

function flatten(spans: TraceSpan[], depth = 0, out: FlatSpan[] = []): FlatSpan[] {
	for (const span of spans) {
		out.push({ span, depth });
		if (span.children) flatten(span.children, depth + 1, out);
	}
	return out;
}

export interface TraceWaterfallProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root spans; falls back to sample data. */
	spans?: TraceSpan[];
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function TraceWaterfall(props: TraceWaterfallProps) {
	const [local, rest] = splitProps(props, ["spans", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-trace-waterfall border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const rows = () => flatten(local.spans ?? SAMPLE_SPANS);
	const total = () => Math.max(1, ...rows().map((r) => r.span.start + r.span.duration));
	const ticks = () => [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(total() * t));

	return (
		<div class={className()} role="img" aria-label="Trace waterfall" {...dom}>
			{/* scale header */}
			<div class="mb-2 flex items-end gap-3">
				<span class="w-40 shrink-0 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Span</span>
				<div class="relative h-4 flex-1">
					<For each={ticks()}>
						{(tick, i) => (
							<span
								class="absolute top-0 text-2xs tabular-nums text-muted-foreground"
								style={{
									left: `${i() * 25}%`,
									transform: i() === 0 ? "none" : i() === 4 ? "translateX(-100%)" : "translateX(-50%)",
								}}
							>
								{tick}ms
							</span>
						)}
					</For>
				</div>
			</div>
			<div class="space-y-1">
				<Show when={rows().length === 0}>
					<p class="py-3 text-center text-muted-foreground">No spans recorded.</p>
				</Show>
				<For each={rows()}>
					{(row) => {
						const left = () => Math.min(100, Math.max(0, (row.span.start / total()) * 100));
						const width = () => Math.max(0.75, Math.min(100 - left(), (row.span.duration / total()) * 100));
						return (
							<div
								class="flex items-center gap-3"
								title={`${row.span.name} — ${row.span.duration}ms @ ${row.span.start}ms`}
							>
								<span class="w-40 shrink-0 truncate text-foreground" style={{ "padding-left": `${row.depth * 14}px` }}>
									{row.span.name}
								</span>
								<div class="relative h-4 flex-1 overflow-hidden rounded bg-muted/60">
									<div
										class={`absolute top-0 h-full rounded ${depthFill[row.depth % depthFill.length]}`}
										style={{ left: `${left()}%`, width: `${width()}%` }}
									/>
								</div>
								<span class="w-12 shrink-0 text-right tabular-nums text-muted-foreground">{row.span.duration}ms</span>
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}
