/**
 * Use case: Advanced Staggering
 * Creates and manages grid, random, and complex stagger patterns
 */

import { AdvancedStagger } from "../../../domain/models/advanced/advanced-stagger";
import type { StaggerFunction, StaggerOptions } from "../../../types/index";

export function createAdvancedStagger(options: StaggerOptions = {}) {
	const advancedStagger = new AdvancedStagger(options);

	return {
		createStaggerFunction: (total: number): StaggerFunction => {
			return advancedStagger.createStaggerFunction(total);
		},
		getStaggerDelay: (index: number, total: number, baseDelay?: number): number => {
			return advancedStagger.getStaggerDelay(index, total, baseDelay);
		},
		getStaggerValue: (index: number, total: number, values: number[]): number => {
			return advancedStagger.getStaggerValue(index, total, values);
		},
	};
}

// Helper function to create stagger values
export function stagger(
	value: number | number[],
	options?: StaggerOptions,
): number | ((index: number, total: number) => number) {
	if (Array.isArray(value)) {
		return (index: number, total: number) => {
			const advancedStagger = new AdvancedStagger(options);
			return advancedStagger.getStaggerValue(index, total, value);
		};
	}
	return value;
}
