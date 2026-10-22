/**
 * TraceSpanBar — waterfall rows for a trace span tree with proportional offset/width and ms labels.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, splitProps } from "solid-js";
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
	/** Start offset in ms from trace origin. */
	start: number;
	/** Duration in ms. */
	duration: number;
	/** Nested child spans. */
	children?: TraceSpan[];
}

export interface TraceSpanBarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
	/** Root span label. */
	name: string;
	/** Root span start offset in ms. */
	start: number;
	/** Root span duration in ms. */
	duration: number;
	/** Child spans of the root span. */
	children?: TraceSpan[];
	/** Track height @default "md" */
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

interface FlatSpan {
	span: TraceSpan;
	depth: number;
}

const flatten = (root: TraceSpan): FlatSpan[] => {
	const out: FlatSpan[] = [];
	const walk = (span: TraceSpan, depth: number) => {
		out.push({ span, depth });
		for (const child of span.children ?? []) walk(child, depth + 1);
	};
	walk(root, 0);
	return out;
};

const traceEnd = (root: TraceSpan): number => {
	let end = root.start + root.duration;
	for (const child of root.children ?? []) end = Math.max(end, traceEnd(child));
	return end;
};

const barHeight = { sm: "h-3", md: "h-4", lg: "h-5" } as const;

export function TraceSpanBar(props: TraceSpanBarProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-trace-span-bar border p-3",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, dom] = splitProps(rest, ["name", "start", "duration", "children"]);
	const root = (): TraceSpan => ({
		name: local.name,
		start: local.start,
		duration: local.duration,
		children: local.children,
	});
	const spans = () => flatten(root());
	const total = () => Math.max(1, traceEnd(root()) - root().start);
	const leftPct = (span: TraceSpan) => Math.max(0, ((span.start - root().start) / total()) * 100);
	const widthPct = (span: TraceSpan) => Math.max(0.5, Math.min(100 - leftPct(span), (span.duration / total()) * 100));
	const height = () => barHeight[props.size ?? "md"];
	return (
		<div class={className()} role="tree" aria-label="Trace spans" {...dom}>
			<div class="space-y-1">
				<For each={spans()}>
					{({ span, depth }) => (
						// biome-ignore lint/a11y/useFocusableInteractive: read-only trace tree — rows are not individually focusable
						<div class="flex items-center gap-2" role="treeitem" aria-level={depth + 1}>
							<span
								class="w-36 shrink-0 truncate text-xs text-foreground"
								style={{ "padding-left": `${depth * 0.75}rem` }}
								title={span.name}
							>
								{span.name}
							</span>
							<div class={`relative min-w-0 flex-1 rounded-sm bg-muted ${height()}`}>
								<div
									class="absolute inset-y-0 rounded-sm bg-primary/70 transition-colors hover:bg-primary"
									style={{ left: `${leftPct(span)}%`, width: `${widthPct(span)}%` }}
									title={`${span.name}: ${span.start} ms +${span.duration} ms`}
								/>
							</div>
							<span class="w-16 shrink-0 text-right text-2xs tabular-nums text-muted-foreground">
								{span.duration} ms
							</span>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
