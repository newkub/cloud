/**
 * Use case: Kinetic Typography
 * Creates and manages text splitting and animation
 */

import { KineticTypography } from "../../../domain/models/graphics/index";
import type { KineticTypographyOptions } from "../../../types/index";

export function createKineticTypography(text: string, options: KineticTypographyOptions = {}) {
	const kineticTypography = new KineticTypography(text, options);

	return {
		split: () => {
			return kineticTypography.split();
		},
		getStaggerDelays: (baseDelay?: number) => {
			return kineticTypography.getStaggerDelays(baseDelay);
		},
		getElements: () => {
			return kineticTypography.getElements();
		},
		getOriginalText: () => {
			return kineticTypography.getOriginalText();
		},
	};
}
