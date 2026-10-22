// Line chart rendering

import { drawAxes, getDefaultColor } from "./canvas-renderer-utils";

// Local type definition since ChartConfig is not exported
interface ChartConfig {
	readonly type: "line" | "bar" | "pie" | "gauge" | "geographic";
	readonly data: {
		readonly labels: readonly string[];
		readonly datasets: readonly {
			readonly data: readonly number[];
			readonly borderColor?: string;
		}[];
	};
}

export const renderLineChart = (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	config: ChartConfig,
): { success: boolean; error?: string } => {
	const { data } = config;
	const { width, height } = canvas;
	const padding = 40;

	drawAxes(ctx, width, height, padding);

	data.datasets.forEach((dataset, datasetIndex) => {
		const color = dataset.borderColor || getDefaultColor(datasetIndex);
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();

		const stepX = (width - 2 * padding) / (data.labels.length - 1);
		const maxY = Math.max(...dataset.data);
		const scaleY = (height - 2 * padding) / maxY;

		dataset.data.forEach((value, index) => {
			const x = padding + index * stepX;
			const y = height - padding - value * scaleY;

			if (index === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		});

		ctx.stroke();
	});

	return { success: true };
};
