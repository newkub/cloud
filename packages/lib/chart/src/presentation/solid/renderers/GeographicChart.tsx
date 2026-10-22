import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Geographic — dot-grid world hint, marker size ∝ value. */
export const renderGeographicChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = firstValues(data);
	const labels = labelsOf(data);
	const max = Math.max(...values, 1);
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const cols = Math.ceil(Math.sqrt(values.length));
	const cw = (width - padding * 2) / cols;
	const rows = Math.ceil(values.length / cols);
	const rh = (height - padding * 2) / Math.max(1, rows);
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Geographic Chart</title>
			<For each={values}>
				{(v, i) => {
					const cx = padding + (i() % cols) * cw + cw / 2;
					const cy = padding + Math.floor(i() / cols) * rh + rh / 2;
					return (
						<>
							<circle cx={cx} cy={cy} r={Math.min(cw, rh) / 2.4} fill="#e5e7eb" />
							<circle cx={cx} cy={cy} r={(Math.min(cw, rh) / 2.4) * (v / max)} fill={PICK(i())}>
								<title>{`${labels[i()] ?? i()}: ${v}`}</title>
							</circle>
							<text x={cx} y={cy} text-anchor="middle" font-size="9" fill="#fff">
								{labels[i()] ?? ""}
							</text>
						</>
					);
				}}
			</For>
		</svg>
	);
};
