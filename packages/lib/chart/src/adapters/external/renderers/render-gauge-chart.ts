// Gauge chart rendering

// Local type definition since ChartConfig is not exported
interface ChartConfig {
	readonly type: "line" | "bar" | "pie" | "gauge" | "geographic";
	readonly data: {
		readonly datasets: readonly {
			readonly data: readonly number[];
		}[];
	};
}

export const renderGaugeChart = (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	config: ChartConfig,
): { success: boolean; error?: string } => {
	const { data } = config;
	const { width, height } = canvas;
	const centerX = width / 2;
	const centerY = height * 0.75;
	const padding = 40;
	const radius = Math.min(width, height) / 2 - padding;

	const firstDataset = data.datasets[0];
	if (!firstDataset || firstDataset.data.length === 0) return { success: true };

	const value = firstDataset.data[0] ?? 0;
	const maxValue = Math.max(...firstDataset.data);
	const percentage = value / maxValue;

	// Draw background arc
	ctx.strokeStyle = "#e0e0e0";
	ctx.lineWidth = 20;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
	ctx.stroke();

	// Draw value arc
	ctx.strokeStyle = percentage > 0.7 ? "#4caf50" : percentage > 0.4 ? "#ff9800" : "#f44336";
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + percentage * Math.PI);
	ctx.stroke();

	// Draw value text
	ctx.fillStyle = "#333";
	ctx.font = "bold 24px sans-serif";
	ctx.textAlign = "center";
	ctx.fillText(value.toString(), centerX, centerY);

	return { success: true };
};
