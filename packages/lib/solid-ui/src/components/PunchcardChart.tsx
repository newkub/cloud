/**
 * PunchcardChart — day × hour dot matrix; dot size = intensity (GitHub punchcard).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PunchcardCell {
	/** Row index — e.g. day of week 0-6. */
	row: number;
	/** Column index — e.g. hour 0-23. */
	col: number;
	value: number;
}

export interface PunchcardChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: PunchcardCell[];
	/** Row labels (short). @default ["Su","Mo","Tu","We","Th","Fr","Sa"] */
	rows?: string[];
	/** Column labels (short) — e.g. hours. */
	cols?: string[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function PunchcardChart(props: PunchcardChartProps) {
	const merged = mergeProps({ rows: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], width: 420, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"rows",
		"cols",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const data = local.data ?? [];
		const nCols = Math.max(1, local.cols?.length ?? 1 + Math.max(0, ...data.map((c) => c.col)));
		const nRows = Math.max(1, local.rows.length);
		const max = Math.max(1, ...data.map((c) => c.value));
		const padL = 28;
		const cw = (local.width - padL - 8) / nCols;
		const rh = (local.height - 20) / nRows;
		return {
			nCols,
			nRows,
			cells: data.map((c) => ({
				cx: padL + c.col * cw + cw / 2,
				cy: 8 + c.row * rh + rh / 2,
				r: 1.5 + (c.value / max) * (Math.min(cw, rh) / 2 - 1),
				v: c.value,
			})),
			cw,
			rh,
			padL,
		};
	};

	return (
		<div
			class={[
				"w-full text-primary",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="h-40 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Punchcard chart">
				<For each={local.rows.slice(0, view().nRows)}>
					{(r, i) => (
						<text x={2} y={8 + i() * view().rh + view().rh / 2 + 3} font-size="8" class="fill-muted-foreground">
							{r}
						</text>
					)}
				</For>
				<For each={view().cells}>
					{(c) => (
						<circle cx={c.cx} cy={c.cy} r={Math.max(1, c.r)} fill="currentColor" opacity="0.8">
							<title>{c.v}</title>
						</circle>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
