import type { StaggerOptions } from "../../../types/index";

const calculateFromIndex = (from: number | "first" | "last" | "center" | "edges" | "index", total: number): number => {
	if (typeof from === "number") {
		return from;
	}
	if (from === "last") {
		return total - 1;
	}
	if (from === "center") {
		return Math.floor(total / 2);
	}
	if (from === "edges") {
		return 0; // Default to first edge
	}
	if (from === "index") {
		return 0; // Will be overridden by actual index
	}
	return 0;
};

const calculateDistance = (index: number, fromIndex: number, direction: "normal" | "reverse"): number => {
	if (direction === "reverse") {
		return fromIndex - index;
	}
	return index - fromIndex;
};

/**
 * Use case: Create staggered animation delays
 */
export function createStaggerFactory() {
	return function stagger(value: number, options: StaggerOptions = {}): (index: number, total: number) => number {
		const { from = "first", direction = "normal", grid, axis = null } = options;

		return (index: number, total: number) => {
			const fromIndex = calculateFromIndex(from, total);
			let distance = calculateDistance(index, fromIndex, direction);

			// Apply grid staggering if specified
			if (grid) {
				const cols = Array.isArray(grid) ? grid[1] : grid.columns;

				const rowIndex = Math.floor(index / cols);
				const colIndex = index % cols;

				if (axis === "x") {
					distance = colIndex;
				} else if (axis === "y") {
					distance = rowIndex;
				} else {
					distance = rowIndex + colIndex;
				}
			}

			return Math.abs(distance) * value;
		};
	};
}

export function createStaggerValuesFactory() {
	return function staggerValues(
		values: number[],
		options: StaggerOptions = {},
	): (index: number, total: number) => number {
		const { from = "first", direction = "normal" } = options;

		return (index: number, total: number) => {
			const fromIndex = calculateFromIndex(from, total);
			const distance = calculateDistance(index, fromIndex, direction);
			const absDistance = Math.abs(distance);
			return values[absDistance % values.length] ?? 0;
		};
	};
}
