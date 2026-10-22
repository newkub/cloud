/**
 * PercentileStrip — horizontal strip with p50/p95/p99 markers and labels.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

interface Marker {
	key: string;
	value: number;
	tone: string;
}

export interface PercentileStripProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** 50th percentile value. */
	p50: number;
	/** 95th percentile value. */
	p95: number;
	/** 99th percentile value. */
	p99: number;
	/** Unit suffix on labels, e.g. "ms". */
	unit?: string;
	/** Strip label rendered above the track. */
	label?: string;
	/** Strip height @default "md" */
	size?: "sm" | "md" | "lg";
	/** Track corner radius @default "full" */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const barHeight = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;

export function PercentileStrip(props: PercentileStripProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-percentile-strip w-full",
		unstyled: props.unstyled,
	});
	const [local, dom] = splitProps(rest, ["p50", "p95", "p99", "unit", "label", "radius", "children"]);
	const num = (value: number) => (Number.isFinite(value) ? value : 0);
	const markers = (): Marker[] => [
		{ key: "p50", value: num(local.p50), tone: "bg-primary" },
		{ key: "p95", value: num(local.p95), tone: "bg-warning" },
		{ key: "p99", value: num(local.p99), tone: "bg-destructive" },
	];
	const max = () => Math.max(1e-9, num(local.p50), num(local.p95), num(local.p99));
	const pos = (value: number) => Math.min(100, Math.max(0, (value / max()) * 100));
	return (
		<div class={className()} {...dom}>
			<Show when={local.label}>
				<div class="mb-1 text-xs font-medium text-muted-foreground">{local.label}</div>
			</Show>
			<div
				role="img"
				aria-label={`Percentiles: p50 ${local.p50}${local.unit ?? ""}, p95 ${local.p95}${local.unit ?? ""}, p99 ${local.p99}${local.unit ?? ""}`}
			>
				<div class={`relative w-full bg-muted ${barHeight[props.size ?? "md"]} ${radiusMap[local.radius ?? "full"]}`}>
					<For each={markers()}>
						{(m) => (
							<div
								class={`absolute -inset-y-0.5 w-0.5 rounded-full ${m.tone}`}
								style={{ left: `calc(${pos(m.value)}% - 1px)` }}
								title={`${m.key} ${m.value}${local.unit ?? ""}`}
								aria-hidden="true"
							/>
						)}
					</For>
				</div>
				<div class="relative mt-1.5 h-7" aria-hidden="true">
					<For each={markers()}>
						{(m) => (
							<div
								class="absolute flex w-14 flex-col items-center text-center"
								style={{ left: `${pos(m.value)}%`, transform: "translateX(-50%)" }}
							>
								<span class="font-medium text-2xs uppercase text-muted-foreground">{m.key}</span>
								<span class="text-2xs font-semibold tabular-nums text-foreground">
									{m.value}
									{local.unit}
								</span>
							</div>
						)}
					</For>
				</div>
			</div>
			{local.children}
		</div>
	);
}
