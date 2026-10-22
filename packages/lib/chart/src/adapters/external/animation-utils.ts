/**
 * Animation utility functions
 * Clean Architecture: Infrastructure layer - Utilities
 */

import { addAnimation, createAnimationEngineState, removeAnimation, tickAnimations } from "./animation-engine";
import type { EasingFunction } from "./easings";
import { easings } from "./easings";

export interface AnimationOptions {
	duration?: number;
	easing?: EasingFunction;
	delay?: number;
	onComplete?: () => void;
}

// Utility function to animate between values
export function animateValue(
	from: number,
	to: number,
	duration: number,
	onUpdate: (value: number) => void,
	easing?: EasingFunction,
	onComplete?: () => void,
	now: number = Date.now(),
): () => void {
	let engineState = createAnimationEngineState();
	const id = `anim-${now}`;
	const easingFn = easing ?? easings.easeInOutCubic;

	if (!easingFn) {
		throw new Error("Easing function not found");
	}

	engineState = addAnimation(engineState, id, from, to, duration, easingFn, onUpdate, onComplete);

	const tick = () => {
		engineState = tickAnimations(engineState);
		if (engineState.rafId !== null) {
			requestAnimationFrame(tick);
		}
	};

	tick();

	return () => {
		engineState = removeAnimation(engineState, id);
	};
}

// Animate array of values
export function animateArray(
	from: readonly number[],
	to: readonly number[],
	duration: number,
	onUpdate: (values: number[]) => void,
	easing?: EasingFunction,
	_onComplete?: () => void,
): () => void {
	let engineState = createAnimationEngineState();
	const stopFunctions: (() => void)[] = [];
	const easingFn = easing ?? easings.easeInOutCubic;

	if (!easingFn) {
		throw new Error("Easing function not found");
	}

	from.forEach((startValue, index) => {
		const endValue = to[index] ?? startValue;
		const id = `anim-${Date.now()}-${index}`;

		engineState = addAnimation(engineState, id, startValue, endValue, duration, easingFn, (value) => {
			const currentValues = [...from];
			currentValues[index] = value;
			onUpdate(currentValues);
		});

		stopFunctions.push(() => {
			engineState = removeAnimation(engineState, id);
		});
	});

	const tick = () => {
		engineState = tickAnimations(engineState);
		if (engineState.rafId !== null) {
			requestAnimationFrame(tick);
		}
	};

	tick();

	return () => {
		stopFunctions.forEach((stop) => {
			stop();
		});
		engineState = createAnimationEngineState();
	};
}
