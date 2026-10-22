/**
 * BulletChart — horizontal target-vs-actual bar with qualitative range bands.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BulletChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Actual value */
	value: number;
	/** Target marker value */
	target: number;
	/** Scale maximum @default auto (largest of value/target/ranges, padded) */
	max?: number;
	/** Row label */
	label?: string;
	/** Qualitative band thresholds, e.g. [60, 80, 100] — drawn worst→best */
	ranges?: number[];
	/** Bar height @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const W = 280;
const barH = { sm: 6, md: 9, lg: 12 } as const;
const rowH = { sm: 20, md: 26, lg: 32 } as const;

export function BulletChart(props: BulletChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"target",
		"max",
		"label",
		"ranges",
		"size",
		"radius",
		"elevation",
	]);
	const max = () => local.max ?? Math.max(1, local.value ?? 0, local.target ?? 0, ...(local.ranges ?? [])) * 1.1;
	const bands = () => [...(local.ranges ?? [])].sort((a, b) => b - a).slice(0, 4);
	const sx = (v: number) => (Math.min(Math.max(0, v), max()) / max()) * W;
	const h = () => rowH[local.size ?? "md"];
	const bh = () => barH[local.size ?? "md"];
	const cy = () => h() / 2;
	return (
		<div
			class={`solidui-bullet-chart w-full max-w-sm ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.label}>
				<div class="mb-1 flex items-baseline justify-between gap-2">
					<span class="text-xs text-muted-foreground">{local.label}</span>
					<span class="text-xs font-medium tabular-nums">
						{local.value}
						<span class="text-muted-foreground"> / {local.target}</span>
					</span>
				</div>
			</Show>
			<svg
				viewBox={`0 0 ${W} ${h()}`}
				class="w-full"
				style={{ height: `${h()}px` }}
				role="img"
				aria-label={local.label ?? `Bullet chart: value ${local.value} of ${max()}, target ${local.target}`}
			>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<For each={bands()}>
					{(b, i) => (
						<rect
							x={0}
							y={cy() - h() / 2}
							width={sx(b)}
							height={h()}
							class="fill-muted-foreground"
							fill-opacity={0.12 + i() * 0.09}
						/>
					)}
				</For>
				<Show when={bands().length === 0}>
					<rect x={0} y={cy() - h() / 2} width={W} height={h()} class="fill-muted" />
				</Show>
				<rect x={0} y={cy() - bh() / 2} width={sx(local.value ?? 0)} height={bh()} class="fill-primary" rx="1" />
				<line
					x1={sx(local.target ?? 0)}
					y1={cy() - bh()}
					x2={sx(local.target ?? 0)}
					y2={cy() + bh()}
					class="stroke-foreground"
					stroke-width="2.5"
					stroke-linecap="round"
				/>
			</svg>
		</div>
	);
}
