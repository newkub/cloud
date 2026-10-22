import { createSignal, onMount, splitProps } from "solid-js";
import type { ChartData, ChartPoint } from "../../modules/chart/types/index";

interface TooltipProps {
	data: ChartData;
	point?: ChartPoint;
	datasetIndex?: number;
	dataIndex?: number;
	visible?: boolean;
	position?: { x: number; y: number };
	format?: (value: number, label: string) => string;
}

// Default props for future use
// const defaultTooltipProps: Partial<TooltipProps> = {
// 	visible: false,
// 	format: (value: number, label: string) => `${label}: ${value}`,
// };

export function Tooltip(props: TooltipProps) {
	const [local] = splitProps(props, ["data", "point", "datasetIndex", "dataIndex", "visible", "position", "format"]);

	const [tooltipPosition, setTooltipPosition] = createSignal({ x: 0, y: 0 });
	const [_isFlippedX, setIsFlippedX] = createSignal(false);
	const [_isFlippedY, setIsFlippedY] = createSignal(false);

	onMount(() => {
		if (local.position) {
			const { x, y } = local.position;
			const tooltipWidth = 200;
			const tooltipHeight = 80;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			const flipX = x + tooltipWidth > windowWidth;
			const flipY = y + tooltipHeight > windowHeight;

			setIsFlippedX(flipX);
			setIsFlippedY(flipY);

			setTooltipPosition({
				x: flipX ? x - tooltipWidth : x,
				y: flipY ? y - tooltipHeight : y,
			});
		}
	});

	if (!local.visible || !local.point || local.dataIndex === undefined) {
		return null;
	}

	const dataset = local.data.datasets?.[local.datasetIndex ?? 0];
	const value = dataset?.data[local.dataIndex];
	const label = local.data.labels?.[local.dataIndex];
	const formattedValue = local.format?.(value ?? 0, label ?? "") ?? `${label}: ${value}`;

	return (
		<div
			class="chart-tooltip"
			style={{
				position: "fixed",
				left: `${tooltipPosition().x}px`,
				top: `${tooltipPosition().y}px`,
				"z-index": 1000,
				"pointer-events": "none",
			}}
		>
			<div
				class="tooltip-content"
				style={{
					"background-color": "rgba(0, 0, 0, 0.8)",
					color: "white",
					padding: "8px 12px",
					"border-radius": "4px",
					"font-size": "12px",
					"white-space": "nowrap",
					"box-shadow": "0 2px 8px rgba(0, 0, 0, 0.2)",
				}}
			>
				{formattedValue}
			</div>
		</div>
	);
}

export interface TooltipState {
	visible: boolean;
	point?: ChartPoint;
	datasetIndex?: number;
	dataIndex?: number;
	position?: { x: number; y: number };
}

export function useTooltip() {
	const [tooltipState, setTooltipState] = createSignal<TooltipState>({
		visible: false,
	});

	const showTooltip = (
		point: ChartPoint,
		datasetIndex: number,
		dataIndex: number,
		position: { x: number; y: number },
	) => {
		setTooltipState({
			visible: true,
			point,
			datasetIndex,
			dataIndex,
			position,
		});
	};

	const hideTooltip = () => {
		setTooltipState({ visible: false });
	};

	return {
		tooltipState,
		showTooltip,
		hideTooltip,
	};
}
