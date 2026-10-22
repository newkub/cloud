/**
 * Use case: Responsive Animation
 * Creates and manages breakpoint-based animations
 */

import { ResponsiveAnimation } from "../../../domain/models/responsive/responsive-animation";
import type { ResponsiveOptions } from "../../../types/index";

export function createResponsiveAnimation(options: ResponsiveOptions = {}) {
	const responsiveAnimation = new ResponsiveAnimation(options);

	return {
		getCurrentBreakpoint: () => {
			return responsiveAnimation.getCurrentBreakpoint();
		},
		getProperties: (propName: string) => {
			return responsiveAnimation.getProperties(propName);
		},
		getProperty: (propName: string, key: string) => {
			return responsiveAnimation.getProperty(propName, key);
		},
		dispose: () => {
			responsiveAnimation.dispose();
		},
	};
}
