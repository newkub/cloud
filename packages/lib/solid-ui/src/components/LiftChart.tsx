/**
 * LiftChart - lift over percentile with a dashed baseline at lift = 1.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface LiftPoint {
	/** Population percentile, 0–100. */
	percentile: number;
	/** Lift versus random targeting — 1 is baseline. */
	lift: number;
}

export interface LiftChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Lift points — falls back to a small sample when omitted. */
	data?: { points: LiftPoint[] };
	/** Accessible svg label. @default "Lift chart" */
	label?: string;
	/** Chart size. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const SAMPLE: LiftPoint[] = [
	{ percentile: 0, lift: 3.2 },
	{ percentile: 20, lift: 2.4 },
	{ percentile: 40, lift: 1.8 },
	{ percentile: 60, lift: 1.4 },
	{ percentile: 80, lift: 1.1 },
	{ percentile: 100, lift: 1 },
];

const px = { sm: 160, md: 220, lg: 280 } as const;
const X0 = 14;
const X1 = 96;
const Y0 = 88;
const Y1 = 6;

export function LiftChart(props: LiftChartProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-lift-chart inline-flex flex-col items-center gap-2",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const points = () => [...(props.data?.points ?? SAMPLE)].sort((a, b) => a.percentile - b.percentile);
	const yMax = () => Math.max(2, ...points().map((p) => p.lift));
	const x = (p: number) => X0 + Math.min(1, Math.max(0, p / 100)) * (X1 - X0);
	const y = (l: number) => Y0 - (Math.max(0, l) / yMax()) * (Y0 - Y1);
	const path = () =>
		points()
			.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.percentile)} ${y(p.lift)}`)
			.join(" ");
	const label = () => props.label ?? "Lift chart";
	const s = () => px[props.size ?? "md"];

	return (
		<div class={className()} {...rest}>
			<svg width={s()} height={s()} viewBox="0 0 100 100" class="max-w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<desc>{`Lift over population percentile; the dashed line marks the random baseline at lift 1.`}</desc>
				<line x1={X0} y1={Y0} x2={X0} y2={Y1} class="stroke-border" stroke-width="0.5" />
				<line x1={X0} y1={Y0} x2={X1} y2={Y0} class="stroke-border" stroke-width="0.5" />
				<line
					x1={X0}
					y1={y(1)}
					x2={X1}
					y2={y(1)}
					class="stroke-muted-foreground"
					stroke-width="0.5"
					stroke-dasharray="2 2"
				/>
				<Show when={points().length > 0}>
					<path d={path()} fill="none" class="stroke-primary" stroke-width="1.5" />
					<For each={points()}>
						{(p) => (
							<circle cx={x(p.percentile)} cy={y(p.lift)} r="1.4" class="fill-primary">
								<title>{`${p.percentile}%: lift ${p.lift}`}</title>
							</circle>
						)}
					</For>
				</Show>
				<text x={X1} y={y(1) - 2} text-anchor="end" class="fill-muted-foreground" font-size="4">
					baseline 1
				</text>
				<text x={(X0 + X1) / 2} y={97} text-anchor="middle" class="fill-muted-foreground" font-size="5">
					Percentile
				</text>
				<text x={-46} y={6} transform="rotate(-90)" text-anchor="middle" class="fill-muted-foreground" font-size="5">
					Lift
				</text>
				<text x={X0} y={93} text-anchor="middle" class="fill-muted-foreground" font-size="4">
					0
				</text>
				<text x={X1} y={93} text-anchor="middle" class="fill-muted-foreground" font-size="4">
					100
				</text>
				<text x={X0 - 3} y={Y0} text-anchor="end" dy="0.3em" class="fill-muted-foreground" font-size="4">
					0
				</text>
				<text x={X0 - 3} y={Y1} text-anchor="end" dy="0.3em" class="fill-muted-foreground" font-size="4">
					{yMax().toFixed(0)}
				</text>
			</svg>
		</div>
	);
}
