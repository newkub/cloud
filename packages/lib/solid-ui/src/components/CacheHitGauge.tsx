/**
 * CacheHitGauge — circular hit-rate dial with hit/miss counts and tone thresholds.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";

export interface CacheHitGaugeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> {
	/** Cache hits. */
	hits: number;
	/** Cache misses. */
	misses: number;
	/** Ring diameter in px @default 96 */
	size?: number;
	/** Stroke thickness in px @default 8 */
	thickness?: number;
	/** Caption under the ring @default "Cache hit rate" */
	label?: string;
	/** Hit-rate fraction at which the ring turns success @default 0.9 */
	successAt?: number;
	/** Hit-rate fraction at which the ring turns warning @default 0.7 */
	warnAt?: number;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const strokeColor = {
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
} as const;

export function CacheHitGauge(props: CacheHitGaugeProps) {
	// `size` is a numeric dimension here, not the density axis — split it (and the
	// data props) off before handing the rest to useComponentClasses.
	const [local, helperProps] = splitProps(props, [
		"hits",
		"misses",
		"size",
		"thickness",
		"label",
		"successAt",
		"warnAt",
		"children",
	]);
	const { className, rest: dom } = useComponentClasses(helperProps, {
		base: "solidui-cache-hit-gauge inline-flex flex-col items-center gap-1.5",
		unstyled: props.unstyled,
	});
	const size = () => local.size ?? 96;
	const thickness = () => local.thickness ?? 8;
	const total = () => Math.max(0, local.hits) + Math.max(0, local.misses);
	const rate = () => (total() > 0 ? Math.max(0, local.hits) / total() : 0);
	const pct = () => Math.round(rate() * 100);
	const tone = (): keyof typeof strokeColor =>
		rate() >= (local.successAt ?? 0.9) ? "success" : rate() >= (local.warnAt ?? 0.7) ? "warning" : "destructive";
	const radius = () => (size() - thickness()) / 2;
	const circumference = () => 2 * Math.PI * radius();
	const dashOffset = () => circumference() - rate() * circumference();
	const ariaLabel = () => `Cache hit rate ${pct()}% — ${local.hits} hits, ${local.misses} misses`;

	return (
		<div class={className()} {...dom}>
			<div class="relative inline-flex items-center justify-center">
				<svg
					role="img"
					aria-label={ariaLabel()}
					width={size()}
					height={size()}
					viewBox={`0 0 ${size()} ${size()}`}
					fill="none"
				>
					<title>{ariaLabel()}</title>
					<circle
						cx={size() / 2}
						cy={size() / 2}
						r={radius()}
						class="text-muted"
						stroke="currentColor"
						stroke-width={thickness()}
						fill="none"
					/>
					<circle
						cx={size() / 2}
						cy={size() / 2}
						r={radius()}
						class={`${strokeColor[tone()]} transition-[stroke-dashoffset] motion-reduce:transition-none`}
						stroke="currentColor"
						stroke-width={thickness()}
						stroke-linecap="round"
						stroke-dasharray={String(circumference())}
						stroke-dashoffset={dashOffset()}
						transform={`rotate(-90 ${size() / 2} ${size() / 2})`}
						fill="none"
					/>
				</svg>
				<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
					<span class="font-bold tabular-nums text-foreground" style={{ "font-size": `${size() / 4}px` }}>
						{pct()}%
					</span>
				</div>
			</div>
			<div class="flex items-center gap-2 text-xs tabular-nums">
				<span class="font-medium text-success">{local.hits} hits</span>
				<span class="text-muted-foreground" aria-hidden="true">
					·
				</span>
				<span class="text-muted-foreground">{local.misses} misses</span>
			</div>
			<Show when={local.label !== null}>
				<span class="text-xs font-medium text-muted-foreground">{local.label ?? "Cache hit rate"}</span>
			</Show>
			{local.children}
		</div>
	);
}
