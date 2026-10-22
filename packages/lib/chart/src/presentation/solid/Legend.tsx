import { createSignal, For } from "solid-js";
import { CHART_CONSTANTS } from "../../shared/constants/index";
import type { ChartData } from "../../modules/chart/types/index";

interface LegendProps {
	data: ChartData;
	visibleDatasets?: readonly number[];
	onToggle?: (datasetIndex: number) => void;
	position?: "top" | "bottom" | "left" | "right";
	vertical?: boolean;
}

export function Legend(props: LegendProps) {
	const [visibleDatasets, setVisibleDatasets] = createSignal<Set<number>>(
		new Set(props.data.datasets.map((_, index) => index)),
	);

	const handleToggle = (datasetIndex: number) => {
		const newVisible = new Set(visibleDatasets());
		if (newVisible.has(datasetIndex)) {
			newVisible.delete(datasetIndex);
		} else {
			newVisible.add(datasetIndex);
		}
		setVisibleDatasets(newVisible);
		props.onToggle?.(datasetIndex);
	};

	const isDatasetVisible = (index: number) => visibleDatasets().has(index);

	const colors = CHART_CONSTANTS.DEFAULT_COLORS;

	return (
		<div
			class="chart-legend"
			style={{
				display: "flex",
				"flex-wrap": "wrap",
				gap: "12px",
				padding: "12px",
				"background-color": "var(--chart-background, #fff)",
				border: `1px solid var(--chart-border, #d1d5db)`,
				"border-radius": "4px",
				"flex-direction": props.vertical ? "column" : "row",
			}}
		>
			<For each={props.data.datasets}>
				{(dataset, index) => (
					<button
						type="button"
						class="legend-item"
						style={{
							display: "flex",
							"align-items": "center",
							gap: "8px",
							cursor: "pointer",
							opacity: isDatasetVisible(index()) ? 1 : 0.5,
							transition: "opacity 0.2s",
							background: "transparent",
							border: "none",
							padding: 0,
							height: "auto",
						}}
						onClick={() => handleToggle(index())}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleToggle(index());
							}
						}}
					>
						<div
							class="legend-color"
							style={{
								width: "12px",
								height: "12px",
								"border-radius": "2px",
								"background-color": dataset.color ?? colors[index() % colors.length],
							}}
						/>
						<span
							class="legend-label"
							style={{
								"font-size": "12px",
								color: "var(--chart-text, #1f2937)",
							}}
						>
							{dataset.label}
						</span>
					</button>
				)}
			</For>
		</div>
	);
}

export interface LegendState {
	visibleDatasets: () => Set<number>;
	toggleDataset: (index: number) => void;
	isVisible: (index: number) => boolean;
}

export function useLegend(data: ChartData): LegendState {
	const [visibleDatasets, setVisibleDatasets] = createSignal<Set<number>>(
		new Set(data.datasets.map((_, index) => index)),
	);

	const toggleDataset = (index: number) => {
		const newVisible = new Set(visibleDatasets());
		if (newVisible.has(index)) {
			newVisible.delete(index);
		} else {
			newVisible.add(index);
		}
		setVisibleDatasets(newVisible);
	};

	const isVisible = (index: number) => visibleDatasets().has(index);

	return {
		visibleDatasets: () => visibleDatasets(),
		toggleDataset,
		isVisible,
	};
}
