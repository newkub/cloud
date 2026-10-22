// Bar chart rendering

import { drawAxes, getDefaultColor } from "./canvas-renderer-utils";

// Local type definition since ChartConfig is not exported
interface ChartConfig {
	readonly type: "line" | "bar" | "pie" | "gauge" | "geographic";
	readonly data: {
		readonly labels: readonly string[];
		readonly datasets: readonly {
			readonly data: readonly number[];
			readonly backgroundColor?: string;
		}[];
	};
}

export const renderBarChart = (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	config: ChartConfig,
): { success: boolean; error?: string } => {
	const { data } = config;
	const { width, height } = canvas;
	const padding = 40;

	drawAxes(ctx, width, height, padding);

	const barWidth = (width - 2 * padding) / data.labels.length / data.datasets.length - 5;
	const maxY = Math.max(...data.datasets.flatMap((d) => d.data));
	const scaleY = (height - 2 * padding) / maxY;

	data.datasets.forEach((dataset, datasetIndex) => {
		const color = dataset.backgroundColor || getDefaultColor(datasetIndex);
		ctx.fillStyle = color;

		dataset.data.forEach((value, index) => {
			const x = padding + index * ((width - 2 * padding) / data.labels.length) + datasetIndex * barWidth;
			const barHeight = value * scaleY;
			const y = height - padding - barHeight;

			ctx.fillRect(x, y, barWidth, barHeight);
		});
	});

	return { success: true };
};
