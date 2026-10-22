/**
 * FeatureImportanceBar - sorted horizontal bars of feature importance values.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FeatureImportance {
	/** Feature name shown on the left. */
	name: string;
	/** Importance score — bar length is relative to the maximum. */
	importance: number;
}

export interface FeatureImportanceBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Feature list — falls back to a small sample when omitted. */
	data?: { features: FeatureImportance[] };
	/** Accessible svg label. @default "Feature importance" */
	label?: string;
	/** Scale maximum — defaults to the largest importance. */
	max?: number;
	/** Chart width in px. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const SAMPLE: FeatureImportance[] = [
	{ name: "age", importance: 0.32 },
	{ name: "income", importance: 0.24 },
	{ name: "clicks", importance: 0.18 },
	{ name: "tenure", importance: 0.12 },
];

const px = { sm: 160, md: 220, lg: 280 } as const;
const ROW_H = 12;
const LABEL_X = 29;
const BAR_X = 31;
const BAR_W = 62;

export function FeatureImportanceBar(props: FeatureImportanceBarProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-feature-importance-bar inline-flex flex-col items-center gap-2",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const items = () => [...(props.data?.features ?? SAMPLE)].sort((a, b) => b.importance - a.importance);
	const max = () => Math.max(props.max ?? 0, ...items().map((f) => f.importance), 1e-9);
	const label = () => props.label ?? "Feature importance";
	const vbH = () => items().length * ROW_H + 2;
	const width = () => px[props.size ?? "md"];
	const height = () => Math.max(16, Math.round((width() * vbH()) / 100));

	return (
		<div class={className()} {...rest}>
			<Show when={items().length > 0} fallback={<p class="text-sm text-muted-foreground">No features</p>}>
				<svg
					width={width()}
					height={height()}
					viewBox={`0 0 100 ${vbH()}`}
					class="max-w-full"
					role="img"
					aria-label={label()}
				>
					<title>{label()}</title>
					<desc>
						{`Sorted feature importances: ${items()
							.map((f) => `${f.name} ${f.importance}`)
							.join(", ")}`}
					</desc>
					<For each={items()}>
						{(f, i) => {
							const w = () => Math.max(0.5, (f.importance / max()) * BAR_W);
							return (
								<g>
									<text x={LABEL_X} y={i() * ROW_H + 9} text-anchor="end" class="fill-foreground" font-size="5">
										{f.name}
									</text>
									<rect x={BAR_X} y={i() * ROW_H + 3.5} width={w()} height={5} rx={1} class="fill-primary">
										<title>{`${f.name}: ${f.importance}`}</title>
									</rect>
									<text
										x={BAR_X + w() + 2}
										y={i() * ROW_H + 9}
										class="fill-muted-foreground tabular-nums"
										font-size="4.5"
									>
										{f.importance}
									</text>
								</g>
							);
						}}
					</For>
				</svg>
			</Show>
		</div>
	);
}
