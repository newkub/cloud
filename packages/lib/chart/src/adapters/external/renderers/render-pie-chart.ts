// Pie chart rendering

import { getDefaultColor } from "./canvas-renderer-utils";

// Local type definition since ChartConfig is not exported
interface ChartConfig {
	readonly type: "line" | "bar" | "pie" | "gauge" | "geographic";
	readonly data: {
		readonly datasets: readonly {
			readonly data: readonly number[];
		}[];
	};
}

export const renderPieChart = (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	config: ChartConfig,
): { success: boolean; error?: string } => {
	const { data } = config;
	const { width, height } = canvas;
	const centerX = width / 2;
	const centerY = height / 2;
	const padding = 40;
	const radius = Math.min(width, height) / 2 - padding;

	const firstDataset = data.datasets[0];
	if (!firstDataset) return { success: true };

	const total = firstDataset.data.reduce((sum, value) => sum + value, 0);
	let startAngle = 0;

	firstDataset.data.forEach((value, index) => {
		const sliceAngle = (value / total) * 2 * Math.PI;
		const color = getDefaultColor(index);

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
		ctx.closePath();
		ctx.fill();

		startAngle += sliceAngle;
	});

	return { success: true };
};
