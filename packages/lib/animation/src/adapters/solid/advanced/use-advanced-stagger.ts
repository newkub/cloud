/**
 * SolidJS composable for Advanced Staggering
 */

import { createMemo } from "solid-js";
import { createAdvancedStagger, stagger } from "../../../modules/animation/application/usecases/advanced";
import type { StaggerOptions } from "../../../modules/animation/types";

export function useAdvancedStagger(options: StaggerOptions = {}) {
	const advancedStagger = createMemo(() => createAdvancedStagger(options));

	return {
		createStaggerFunction: (total: number) => {
			return advancedStagger().createStaggerFunction(total);
		},
		getStaggerDelay: (index: number, total: number, baseDelay?: number) => {
			return advancedStagger().getStaggerDelay(index, total, baseDelay);
		},
		getStaggerValue: (index: number, total: number, values: number[]) => {
			return advancedStagger().getStaggerValue(index, total, values);
		},
	};
}

// Re-export stagger helper for convenience
export { stagger };
