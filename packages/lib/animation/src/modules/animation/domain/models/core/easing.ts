/**
 * Easing Value Object - Easing function management
 * Refactored to use pure functions and immutable data structures
 */

export type EasingFunction = (t: number) => number;

export type EasingType =
	| "linear"
	| "easeInQuad"
	| "easeOutQuad"
	| "easeInOutQuad"
	| "easeInCubic"
	| "easeOutCubic"
	| "easeInOutCubic"
	| "easeInElastic"
	| "easeOutElastic"
	| "easeInOutElastic"
	| "easeInBounce"
	| "easeOutBounce"
	| "easeInOutBounce";

const easeOutBounce: EasingFunction = (t) => {
	const n1 = 7.5625;
	const d1 = 2.75;
	if (t < 1 / d1) {
		return n1 * t * t;
	} else if (t < 2 / d1) {
		const adjustedT = t - 1.5 / d1;
		return n1 * adjustedT * adjustedT + 0.75;
	} else if (t < 2.5 / d1) {
		const adjustedT = t - 2.25 / d1;
		return n1 * adjustedT * adjustedT + 0.9375;
	} else {
		const adjustedT = t - 2.625 / d1;
		return n1 * adjustedT * adjustedT + 0.984375;
	}
};

const defaultFunctions: Record<EasingType, EasingFunction> = {
	linear: (t) => t,
	easeInQuad: (t) => t * t,
	easeOutQuad: (t) => t * (2 - t),
	easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
	easeInCubic: (t) => t * t * t,
	easeOutCubic: (t) => --t * t * t + 1,
	easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
	easeInElastic: (t) => {
		const c4 = (2 * Math.PI) / 3;
		return t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
	},
	easeOutElastic: (t) => {
		const c4 = (2 * Math.PI) / 3;
		return t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
	},
	easeInOutElastic: (t) => {
		const c5 = (2 * Math.PI) / 4.5;
		return t === 0
			? 0
			: t === 1
				? 1
				: t < 0.5
					? -(2 ** (20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
					: (2 ** (-20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
	},
	easeInBounce: (t) => 1 - easeOutBounce(1 - t),
	easeOutBounce,
	easeInOutBounce: (t) => (t < 0.5 ? (1 - easeOutBounce(1 - 2 * t)) / 2 : (1 + easeOutBounce(2 * t - 1)) / 2),
};

const customFunctions: Record<string, EasingFunction> = {};

/**
 * Get easing function by type
 */
export const getEasing = (type: EasingType): EasingFunction => defaultFunctions[type] || defaultFunctions.linear;

/**
 * Register custom easing function
 */
export const registerEasing = (type: string, fn: EasingFunction): void => {
	customFunctions[type] = fn;
};

/**
 * Get custom easing function
 */
export const getCustomEasing = (type: string): EasingFunction | undefined => customFunctions[type];

/**
 * List all available easing types
 */
export const listEasingTypes = (): EasingType[] => Object.keys(defaultFunctions) as EasingType[];
