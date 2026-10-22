/**
 * RocCurve - ROC curve with a diagonal chance baseline, labeled axes, and an AUC readout.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface RocPoint {
	/** False positive rate, 0–1. */
	fpr: number;
	/** True positive rate, 0–1. */
	tpr: number;
}

export interface RocCurveData {
	points: RocPoint[];
	/** Area under the curve — computed via trapezoids when omitted. */
	auc?: number;
}

export interface RocCurveProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Curve data — falls back to a small sample when omitted. */
	data?: RocCurveData;
	/** Accessible svg label. @default "ROC curve" */
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

const SAMPLE: RocCurveData = {
	points: [
		{ fpr: 0, tpr: 0 },
		{ fpr: 0.1, tpr: 0.55 },
		{ fpr: 0.3, tpr: 0.8 },
		{ fpr: 0.6, tpr: 0.92 },
		{ fpr: 1, tpr: 1 },
	],
};

const px = { sm: 160, md: 220, lg: 280 } as const;
const X0 = 14;
const X1 = 96;
const Y0 = 88;
const Y1 = 6;

export function RocCurve(props: RocCurveProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-roc-curve inline-flex flex-col items-center gap-2",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const data = () => props.data ?? SAMPLE;
	const points = () => [...(data().points ?? [])].sort((a, b) => a.fpr - b.fpr);
	const x = (fpr: number) => X0 + Math.min(1, Math.max(0, fpr)) * (X1 - X0);
	const y = (tpr: number) => Y0 - Math.min(1, Math.max(0, tpr)) * (Y0 - Y1);
	const path = () =>
		points()
			.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.fpr)} ${y(p.tpr)}`)
			.join(" ");
	const auc = () => {
		const given = data().auc;
		if (given !== undefined) return given;
		const pts = points();
		let a = 0;
		for (let i = 1; i < pts.length; i += 1) {
			a += ((pts[i].fpr - pts[i - 1].fpr) * (pts[i].tpr + pts[i - 1].tpr)) / 2;
		}
		return a;
	};
	const label = () => props.label ?? "ROC curve";
	const s = () => px[props.size ?? "md"];

	return (
		<div class={className()} {...rest}>
			<svg width={s()} height={s()} viewBox="0 0 100 100" class="max-w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<desc>{`Receiver operating characteristic curve. AUC ${auc().toFixed(2)}.`}</desc>
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
				<Show when={points().length > 0}>
					<path d={path()} fill="none" class="stroke-primary" stroke-width="1.5" />
					<For each={points()}>{(p) => <circle cx={x(p.fpr)} cy={y(p.tpr)} r="1.2" class="fill-primary" />}</For>
				</Show>
				<text x={X1} y={Y0 - 4} text-anchor="end" class="fill-foreground tabular-nums" font-size="6" font-weight="600">
					{`AUC ${auc().toFixed(2)}`}
				</text>
				<text x={(X0 + X1) / 2} y={97} text-anchor="middle" class="fill-muted-foreground" font-size="5">
					False Positive Rate
				</text>
				<text x={-46} y={6} transform="rotate(-90)" text-anchor="middle" class="fill-muted-foreground" font-size="5">
					True Positive Rate
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
