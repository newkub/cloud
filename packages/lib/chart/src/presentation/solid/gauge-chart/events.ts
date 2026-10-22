import type { ChartPoint } from "../../../modules/chart/types/index";
import type { GaugeChartComponentProps } from "./types";

export function createMouseHandlers(
	canvasRef: HTMLCanvasElement | undefined,
	isReady: () => boolean,
	chartWidth: () => number,
	chartHeight: () => number,
	props: GaugeChartComponentProps,
) {
	const handleMouseMove = (event: MouseEvent) => {
		if (!canvasRef || !isReady()) return;

		const rect = canvasRef.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		// Check if mouse is over chart
		const width = chartWidth() ?? 0;
		const height = chartHeight() ?? 0;
		const centerX = width / 2;
		const centerY = height / 2;
		const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
		const radius = Math.min(centerX, centerY) - (props.padding ?? 40);

		if (distance <= radius) {
			const data: ChartPoint = { x, y };
			props.onHover?.(event, data);
		} else {
			props.onHover?.(event, null);
		}
	};

	const handleClick = (event: MouseEvent) => {
		if (!canvasRef || !isReady()) return;

		const rect = canvasRef.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const data: ChartPoint = { x, y };
		props.onClick?.(event, data);
	};

	return { handleMouseMove, handleClick };
}
