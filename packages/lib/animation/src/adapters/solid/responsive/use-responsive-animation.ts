/**
 * SolidJS composable for Responsive Animation
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createResponsiveAnimation } from "../../../modules/animation/application/usecases/responsive/use-responsive-animation";
import type { ResponsiveOptions } from "../../../modules/animation/types";

export function useResponsiveAnimation(options: ResponsiveOptions = {}) {
	const [responsiveAnimation, setResponsiveAnimation] = createSignal<ReturnType<
		typeof createResponsiveAnimation
	> | null>(null);
	const [currentBreakpoint, setCurrentBreakpoint] = createSignal("base");

	const createResponsiveInstance = () => {
		const ra = createResponsiveAnimation(options);
		setResponsiveAnimation(ra);
		setCurrentBreakpoint(ra.getCurrentBreakpoint());
		return ra;
	};

	const getProperties = (propName: string) => {
		const ra = responsiveAnimation();
		if (ra) {
			return ra.getProperties(propName);
		}
		return {};
	};

	const getProperty = (propName: string, key: string) => {
		const ra = responsiveAnimation();
		if (ra) {
			return ra.getProperty(propName, key);
		}
		return 0;
	};

	const updateBreakpoint = () => {
		const ra = responsiveAnimation();
		if (ra) {
			setCurrentBreakpoint(ra.getCurrentBreakpoint());
		}
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createResponsiveInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		getProperties,
		getProperty,
		currentBreakpoint,
		updateBreakpoint,
		responsiveAnimation,
	};
}
