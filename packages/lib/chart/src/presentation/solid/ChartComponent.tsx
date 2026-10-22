import { createEffect, createSignal, onCleanup, onMount, splitProps } from "solid-js";
import { createCanvasRenderer } from "../../adapters/external/renderers/index";
import type { ChartConfig } from "../../modules/chart/types/index";

interface ChartComponentProps {
	config: ChartConfig;
	width?: number;
	height?: number;
	onReady?: (canvas: HTMLCanvasElement) => void;
	onClick?: (event: MouseEvent, data: { x: number; y: number }) => void;
	onHover?: (event: MouseEvent, data: { x: number; y: number } | null) => void;
}

// Default props for future use
// const defaultChartComponentProps: Partial<ChartComponentProps> = {
// 	width: 800,
// 	height: 400,
// };

export function ChartComponent(props: ChartComponentProps) {
	const [local] = splitProps(props, ["config", "width", "height", "onReady", "onClick", "onHover"]);

	const [_containerRef, setContainerRef] = createSignal<HTMLDivElement>();
	const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
	let renderer: ReturnType<typeof createCanvasRenderer> | null = null;

	onMount(async () => {
		const canvas = canvasRef();
		if (canvas) {
			renderer = createCanvasRenderer(canvas);
			await renderer.render(local.config);
			local.onReady?.(canvas);
		}
	});

	onCleanup(async () => {
		if (renderer) {
			await renderer.destroy();
		}
	});

	createEffect(async () => {
		if (renderer) {
			await renderer.render(local.config);
		}
	});

	// Event handlers
	const handleClick = (event: MouseEvent) => {
		const canvas = canvasRef();
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		local.onClick?.(event, { x, y });
	};

	const handleMouseMove = (event: MouseEvent) => {
		const canvas = canvasRef();
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		local.onHover?.(event, { x, y });
	};

	return (
		<div ref={setContainerRef} class="chart-container">
			<canvas
				ref={setCanvasRef}
				width={local.width}
				height={local.height}
				onClick={handleClick}
				onMouseMove={handleMouseMove}
			/>
		</div>
	);
}
