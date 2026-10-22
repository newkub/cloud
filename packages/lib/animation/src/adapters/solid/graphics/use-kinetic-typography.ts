/**
 * SolidJS composable for Kinetic Typography
 */

import { createEffect, createSignal } from "solid-js";
import { createKineticTypography } from "../../../modules/animation/application/usecases/graphics";
import type { KineticTypographyOptions } from "../../../modules/animation/types";

export function useKineticTypography(text: string, options: KineticTypographyOptions = {}) {
	const [kineticTypography, setKineticTypography] = createSignal<ReturnType<typeof createKineticTypography> | null>(
		null,
	);
	const [elements, setElements] = createSignal<HTMLElement[]>([]);
	const [staggerDelays, setStaggerDelays] = createSignal<number[]>([]);

	const split = () => {
		const kt = createKineticTypography(text, options);
		const els = kt.split();
		const delays = kt.getStaggerDelays();
		setKineticTypography(kt);
		setElements(els);
		setStaggerDelays(delays);
		return els;
	};

	const getStaggerDelays = (baseDelay?: number) => {
		const kt = kineticTypography();
		if (kt) {
			const delays = kt.getStaggerDelays(baseDelay);
			setStaggerDelays(delays);
			return delays;
		}
		return [];
	};

	// Auto-split on mount
	createEffect(() => {
		split();
	});

	return {
		split,
		getStaggerDelays,
		elements,
		staggerDelays,
		kineticTypography,
	};
}
