/**
 * Advanced Stagger Domain Model
 * Handles grid, random, and complex stagger patterns
 */

import type { EasingFunction, StaggerFunction, StaggerOptions } from "../../../types";

export class AdvancedStagger {
	private options: StaggerOptions;
	private easing?: string | EasingFunction;

	constructor(options: StaggerOptions = {}) {
		this.options = {
			from: "first",
			axis: "x",
			...options,
		};
		this.easing = options.easing;
	}

	public createStaggerFunction(total: number): StaggerFunction {
		return (index: number) => {
			let progress: number;

			switch (this.options.from) {
				case "first":
					progress = index / (total - 1 || 1);
					break;
				case "last":
					progress = (total - 1 - index) / (total - 1 || 1);
					break;
				case "center":
					progress = Math.abs(index - (total - 1) / 2) / ((total - 1) / 2 || 1);
					break;
				case "edges":
					if (index === 0 || index === total - 1) {
						progress = 0;
					} else {
						progress = Math.abs(index - (total - 1) / 2) / ((total - 1) / 2 || 1);
					}
					break;
				case "index":
					progress = index;
					break;
				default:
					progress = index / (total - 1 || 1);
			}

			// Apply grid staggering if specified
			if (this.options.grid) {
				progress = this.applyGridStagger(index, total);
			}

			// Apply random staggering if specified
			if (this.options.random) {
				progress = this.options.random();
			}

			// Apply easing
			progress = this.applyEasing(progress);

			return progress;
		};
	}

	private applyGridStagger(index: number, total: number): number {
		if (!this.options.grid) return index / (total - 1 || 1);

		let rows: number;
		let cols: number;

		if (Array.isArray(this.options.grid)) {
			[rows, cols] = this.options.grid;
		} else {
			rows = this.options.grid.rows;
			cols = this.options.grid.columns;
		}

		const row = Math.floor(index / cols);
		const col = index % cols;

		if (this.options.axis === "x") {
			// Stagger along x-axis (columns)
			return col / (cols - 1 || 1);
		} else {
			// Stagger along y-axis (rows)
			return row / (rows - 1 || 1);
		}
	}

	private applyEasing(progress: number): number {
		if (!this.easing || typeof this.easing === "string") {
			return progress;
		}
		return this.easing(progress);
	}

	public getStaggerDelay(index: number, total: number, baseDelay: number = 100): number {
		const staggerFn = this.createStaggerFunction(total);
		const progress = staggerFn(index);
		return progress * baseDelay;
	}

	public getStaggerValue(index: number, total: number, values: number[]): number {
		if (values.length === 0) return 0;
		const staggerFn = this.createStaggerFunction(total);
		const progress = staggerFn(index);
		const valueIndex = Math.min(Math.floor(progress * values.length), values.length - 1);
		return values[valueIndex] ?? 0;
	}
}
