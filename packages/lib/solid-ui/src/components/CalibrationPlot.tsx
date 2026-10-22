/**
 * CalibrationPlot - predicted-vs-observed calibration curve against a perfect diagonal.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CalibrationBin {
	/** Mean predicted probability in the bin, 0–1. */
	predicted: number;
	/** Observed frequency in the bin, 0–1. */
	observed: number;
}

export interface CalibrationPlotProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Calibration bins — falls back to a small sample when omitted. */
	data?: { bins: CalibrationBin[] };
	/** Accessible svg label. @default "Calibration plot" */
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

const SAMPLE: CalibrationBin[] = [
	{ predicted: 0.1, observed: 0.08 },
	{ predicted: 0.3, observed: 0.34 },
	{ predicted: 0.5, observed: 0.48 },
	{ predicted: 0.7, observed: 0.75 },
	{ predicted: 0.9, observed: 0.85 },
];

const px = { sm: 160, md: 220, lg: 280 } as const;
const X0 = 14;
const X1 = 96;
const Y0 = 88;
const Y1 = 6;

export function CalibrationPlot(props: CalibrationPlotProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-calibration-plot inline-flex flex-col items-center gap-2",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const bins = () => [...(props.data?.bins ?? SAMPLE)].sort((a, b) => a.predicted - b.predicted);
	const x = (p: number) => X0 + Math.min(1, Math.max(0, p)) * (X1 - X0);
	const y = (o: number) => Y0 - Math.min(1, Math.max(0, o)) * (Y0 - Y1);
	const path = () =>
		bins()
			.map((b, i) => `${i === 0 ? "M" : "L"} ${x(b.predicted)} ${y(b.observed)}`)
			.join(" ");
	const label = () => props.label ?? "Calibration plot";
	const s = () => px[props.size ?? "md"];

	return (
		<div class={className()} {...rest}>
			<svg width={s()} height={s()} viewBox="0 0 100 100" class="max-w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<desc>Observed frequency versus predicted probability; the dashed line is perfect calibration.</desc>
				<line x1={X0} y1={Y0} x2={X0} y2={Y1} class="stroke-border" stroke-width="0.5" />
				<line x1={X0} y1={Y0} x2={X1} y2={Y0} class="stroke-border" stroke-width="0.5" />
				<line
					x1={X0}
					y1={Y0}
					x2={X1}
					y2={Y1}
					class="stroke-muted-foreground"
					stroke-width="0.5"
					stroke-dasharray="2 2"
				/>
				<Show when={bins().length > 0}>
					<path d={path()} fill="none" class="stroke-primary" stroke-width="1.5" />
					<For each={bins()}>
						{(b) => (
							<circle cx={x(b.predicted)} cy={y(b.observed)} r="1.4" class="fill-primary">
								<title>{`predicted ${b.predicted}, observed ${b.observed}`}</title>
							</circle>
						)}
					</For>
				</Show>
				<text x={(X0 + X1) / 2} y={97} text-anchor="middle" class="fill-muted-foreground" font-size="5">
					Predicted
				</text>
				<text x={-46} y={6} transform="rotate(-90)" text-anchor="middle" class="fill-muted-foreground" font-size="5">
					Observed
				</text>
				<text x={X0} y={93} text-anchor="middle" class="fill-muted-foreground" font-size="4">
					0
				</text>
				<text x={X1} y={93} text-anchor="middle" class="fill-muted-foreground" font-size="4">
					1
				</text>
				<text x={X0 - 3} y={Y0} text-anchor="end" dy="0.3em" class="fill-muted-foreground" font-size="4">
					0
				</text>
				<text x={X0 - 3} y={Y1} text-anchor="end" dy="0.3em" class="fill-muted-foreground" font-size="4">
					1
				</text>
			</svg>
		</div>
	);
}
