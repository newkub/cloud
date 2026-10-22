import { For, type JSX } from "solid-js";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Word cloud — labels sized by value, spiral-ish placement. */
export const renderWordCloudChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = firstValues(data);
	const labels = labelsOf(data);
	const max = Math.max(...values, 1);
	const cx = width / 2;
	const cy = height / 2;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Word Cloud</title>
			<For each={values}>
				{(v, i) => {
					const a = i() * 2.4;
					const rr = (i() / Math.max(1, values.length)) * Math.min(width, height) * 0.32;
					const size = 10 + (v / max) * 26;
					return (
						<text
							x={cx + rr * Math.cos(a)}
							y={cy + rr * Math.sin(a)}
							text-anchor="middle"
							font-size={`${size}`}
							font-weight={i() % 2 ? "600" : "400"}
							fill={PICK(i())}
							opacity="0.9"
						>
							{labels[i()] ?? `${v}`}
						</text>
					);
				}}
			</For>
		</svg>
	);
};
