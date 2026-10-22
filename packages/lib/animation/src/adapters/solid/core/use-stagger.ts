import type { StaggerOptions } from "../../../modules/animation/types/index";

export function useStagger(value: number, options: StaggerOptions = {}) {
	const staggerFn = (index: number, total: number) => {
		const { from = "first", direction = "normal", grid, axis = null } = options;

		let fromIndex = 0;

		if (typeof from === "number") {
			fromIndex = from;
		} else if (from === "last") {
			fromIndex = total - 1;
		} else if (from === "center") {
			fromIndex = Math.floor(total / 2);
		}

		let distance: number;
		if (direction === "reverse") {
			distance = fromIndex - index;
		} else {
			distance = index - fromIndex;
		}

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

	return staggerFn;
}
