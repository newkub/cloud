import { For, type JSX } from "solid-js";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { PAD, PICK, quartile, sorted } from "./chart-helpers";

/** Boxplot — one box+whiskers per dataset (quartiles from its data). */
export const renderBoxplotChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const datasets = data.datasets ?? [];
	const all = datasets.flatMap((d) => d.data);
	const min = Math.min(...all, 0);
	const max = Math.max(...all, 1);
	const cw = width - PAD * 2;
	const ch = height - PAD * 2;
	const n = Math.max(1, datasets.length);
	const slot = cw / n;
	const y = (v: number) => PAD + ch - ((v - min) / (max - min || 1)) * ch;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Boxplot</title>
			<For each={datasets}>
				{(ds, i) => {
					const s = sorted(ds.data);
					const cx = PAD + i() * slot + slot / 2;
					const bw = slot * 0.45;
					return (
						<>
							<line x1={cx} y1={y(s[0] ?? 0)} x2={cx} y2={y(quartile(s, 0.25))} stroke={PICK(i())} stroke-width="1.5" />
							<line
								x1={cx}
								y1={y(quartile(s, 0.75))}
								x2={cx}
								y2={y(s[s.length - 1] ?? 0)}
								stroke={PICK(i())}
								stroke-width="1.5"
							/>
							<line
								x1={cx - bw / 3}
								y1={y(s[0] ?? 0)}
								x2={cx + bw / 3}
								y2={y(s[0] ?? 0)}
								stroke={PICK(i())}
								stroke-width="1.5"
							/>
							<line
								x1={cx - bw / 3}
								y1={y(s[s.length - 1] ?? 0)}
								x2={cx + bw / 3}
								y2={y(s[s.length - 1] ?? 0)}
								stroke={PICK(i())}
								stroke-width="1.5"
							/>
							<rect
								x={cx - bw / 2}
								y={y(quartile(s, 0.75))}
								width={bw}
								height={Math.max(1, y(quartile(s, 0.25)) - y(quartile(s, 0.75)))}
								fill={PICK(i())}
								opacity="0.4"
							/>
							<line
								x1={cx - bw / 2}
								y1={y(quartile(s, 0.5))}
								x2={cx + bw / 2}
								y2={y(quartile(s, 0.5))}
								stroke={PICK(i())}
								stroke-width="2"
							/>
							<text x={cx} y={height - 8} text-anchor="middle" font-size="10" fill="#6b7280">
								{ds.label}
							</text>
						</>
					);
				}}
			</For>
		</svg>
	);
};

/** Candlestick — OHLC derived per label (open = prev close, wicks ±6%). */
export const renderCandlestickChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const closes = data.datasets?.[0]?.data ?? [];
	const max = Math.max(...closes.map((v) => v * 1.06), 1);
	const min = Math.min(...closes.map((v) => v * 0.94), 0);
	const cw = width - PAD * 2;
	const ch = height - PAD * 2;
	const n = Math.max(1, closes.length);
	const slot = cw / n;
	const y = (v: number) => PAD + ch - ((v - min) / (max - min || 1)) * ch;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Candlestick Chart</title>
			<For each={closes}>
				{(close, i) => {
					const open = i() > 0 ? (closes[i() - 1] ?? close) : close * 0.98;
					const high = Math.max(open, close) * 1.03;
					const low = Math.min(open, close) * 0.97;
					const up = close >= open;
					const cx = PAD + i() * slot + slot / 2;
					const bw = slot * 0.5;
					const c = up ? "#10b981" : "#ef4444";
					return (
						<>
							<line x1={cx} y1={y(low)} x2={cx} y2={y(high)} stroke={c} stroke-width="1.5" />
							<rect
								x={cx - bw / 2}
								y={y(Math.max(open, close))}
								width={bw}
								height={Math.max(1, Math.abs(y(open) - y(close)))}
								fill={c}
							/>
						</>
					);
				}}
			</For>
		</svg>
	);
};

/** Histogram — values binned into ~10 buckets. */
export const renderHistogramChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const min = Math.min(...values, 0);
	const max = Math.max(...values, 1);
	const bins = Math.min(10, Math.max(3, Math.ceil(Math.sqrt(values.length))));
	const counts = new Array(bins).fill(0);
	for (const v of values) counts[Math.min(bins - 1, Math.floor(((v - min) / (max - min || 1)) * bins))]++;
	const cmax = Math.max(...counts, 1);
	const cw = width - PAD * 2;
	const ch = height - PAD * 2;
	const bw = cw / bins;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Histogram</title>
			<For each={counts}>
				{(c, i) => (
					<rect
						x={PAD + i() * bw + 1}
						y={PAD + ch - (c / cmax) * ch}
						width={bw - 2}
						height={(c / cmax) * ch}
						fill={PICK(0)}
						opacity="0.8"
					>
						<title>{`${c} in bin ${i() + 1}`}</title>
					</rect>
				)}
			</For>
			<text x={PAD} y={height - 8} font-size="10" fill="#6b7280">
				{min}
			</text>
			<text x={width - PAD} y={height - 8} text-anchor="end" font-size="10" fill="#6b7280">
				{max}
			</text>
		</svg>
	);
};
